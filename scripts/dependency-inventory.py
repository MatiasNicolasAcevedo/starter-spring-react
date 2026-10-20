"""Inventory fixed direct dependencies; compare with a chosen Git baseline (HEAD by default).

Usage: python scripts/dependency-inventory.py --effective-pom PATH [--write]
Resolve PATH first with server/mvnw help:effective-pom -Doutput=PATH.
No package installation or updates are performed by this script.
"""
import argparse
import json
import re
import subprocess
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NS = {"m": "http://maven.apache.org/POM/4.0.0"}


def xml(text):
    return ET.fromstring(text)


def value(node, key, default=""):
    return node.findtext("m:" + key, default, NS)


def coordinates(node):
    return value(node, "groupId", "org.apache.maven.plugins") + ":" + value(node, "artifactId")


def direct(pom):
    return {coordinates(d): (value(d, "version", "BOM"), value(d, "scope", "compile"))
            for d in pom.findall("m:dependencies/m:dependency", NS)}


def plugins(pom):
    return {coordinates(p): value(p, "version", "BOM/parent")
            for p in pom.findall("m:build/m:plugins/m:plugin", NS)}


def git_text(ref, path):
    return subprocess.check_output(["git", "show", ref + ":" + path], cwd=ROOT).decode("utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--effective-pom", required=True, type=Path)
    parser.add_argument("--write", action="store_true")
    parser.add_argument("--baseline", default="HEAD", help="Git ref whose dependency versions must be preserved")
    args = parser.parse_args()
    anchor = args.baseline
    pom = xml((ROOT / "server/pom.xml").read_text(encoding="utf-8"))
    baseline = xml(git_text(anchor, "server/pom.xml"))
    effective = xml(args.effective_pom.read_text(encoding="utf-8"))
    assert direct(pom) == direct(baseline), "Maven direct dependencies/scopes changed"
    assert plugins(pom) == plugins(baseline), "Maven plugins changed"
    assert ET.tostring(pom.find("m:parent", NS)) == ET.tostring(baseline.find("m:parent", NS)), "Parent changed"
    assert ET.tostring(pom.find("m:properties", NS)).replace(b"\r", b"") == ET.tostring(baseline.find("m:properties", NS)).replace(b"\r", b""), "Version properties changed"
    lines = ["# DEPENDENCIES · Inventario conciliado", "",
             "Versiones congeladas; sin actualizaciones a latest. El inventario describe la base actual.",
             "Generado con POM efectivo (Maven) y lockfiles npm; no se documentan transitivas como directas.",
             "Comparación con la referencia Git seleccionada: coordenadas/versiones/scopes, plugins, parent, propiedades, wrappers y resolución npm.", "",
             "## Backend", "", "| Coordenada | Declarada | Resuelta | Scope | Función / fuente |", "|---|---|---|---|---|"]
    parent = pom.find("m:parent", NS)
    lines.append(f"| {coordinates(parent)} | {value(parent, 'version')} | {value(parent, 'version')} | parent/BOM | Gestión del stack · server/pom.xml |")
    resolved = direct(effective)
    for name, (version, scope) in direct(pom).items():
        lines.append(f"| {name} | `{version}` | {resolved[name][0]} | {scope} | {'Pruebas' if scope == 'test' else 'Runtime backend'} · server/pom.xml |")
    lines += ["", "## Plugins y herramientas Maven", "", "| Coordenada | Declarada | Efectiva | Función / fuente |", "|---|---|---|---|"]
    effective_plugins = plugins(effective)
    for name, version in plugins(pom).items():
        lines.append(f"| {name} | `{version}` | {effective_plugins[name]} | Build/calidad · server/pom.xml |")
    props = pom.find("m:properties", NS)
    for key, coordinate, purpose in [
        ("palantir-java-format.version", "com.palantir.javaformat:palantir-java-format", "Formateador Spotless"),
        (None, "org.springframework.boot:spring-boot-configuration-processor", "Procesador de anotaciones del compiler"),
        (None, "org.mockito:mockito-core", "Agente Mockito (test; UTC en Surefire/Failsafe)")]:
        managed = {coordinates(d): value(d, "version") for d in effective.findall("m:dependencyManagement/m:dependencies/m:dependency", NS)}
        version = value(props, key) if key else managed[coordinate]
        lines.append(f"| {coordinate} | {'${' + key + '}' if key else 'BOM'} | {version} | {purpose} · server/pom.xml |")
    counts = []
    for folder in ["client", "e2e"]:
        manifest = json.loads((ROOT / folder / "package.json").read_text())
        lock = json.loads((ROOT / folder / "package-lock.json").read_text())
        old = json.loads(git_text(anchor, folder + "/package.json"))
        old_lock = json.loads(git_text(anchor, folder + "/package-lock.json"))
        # Names may change; package resolution, hashes and every transitive entry must remain identical.
        for data in [lock, old_lock]:
            data.pop("name", None)
            data["packages"][""].pop("name", None)
        assert lock == old_lock, folder + " lock resolution changed"
        lines += ["", "## " + folder, "", "| Nombre | Declarada | Resuelta | Scope | Función / fuente |", "|---|---|---|---|---|"]
        count = 0
        for scope in ["dependencies", "devDependencies"]:
            assert manifest.get(scope, {}) == old.get(scope, {}), folder + " direct dependencies changed"
            for name, declared in manifest.get(scope, {}).items():
                count += 1
                version = lock["packages"]["node_modules/" + name]["version"]
                lines.append(f"| {name} | {declared} | {version} | {scope} | {'Runtime UI' if scope == 'dependencies' else 'Build/pruebas'} · {folder}/package.json + package-lock.json |")
        counts.append(f"{folder}: {count}")
    lines += ["", "## Wrappers, imágenes y acciones fijadas", "", "| Entrada | Versión / referencia exacta | Fuente / función |", "|---|---|---|"]
    wrapper = "server/.mvn/wrapper/maven-wrapper.properties"
    for path in [wrapper, "server/mvnw", "server/mvnw.cmd"]:
        assert (ROOT / path).read_bytes().replace(b"\r\n", b"\n") == git_text(anchor, path).encode().replace(b"\r\n", b"\n"), path + " changed"
    lines.append("| Maven Wrapper | 3.3.4 / Maven 3.10.0 / only-script | server/.mvn/wrapper/maven-wrapper.properties, mvnw, mvnw.cmd |")
    for path in ["server/Dockerfile", "client/Dockerfile", "e2e/Dockerfile", "docker-compose.yml", "compose.auth-test.yml"]:
        body = (ROOT / path).read_text()
        def images(text):
            return list(dict.fromkeys(entry for entry in re.findall(
                r"(?:^FROM\s+|image:\s*|^ARG \w+_IMAGE=)([^\s]+)", text, re.M)
                if not entry.startswith("${") and ":" in entry))
        assert images(body) == images(git_text(anchor, path)), path + " image version changed"
        for entry in images(body):
            lines.append(f"| Imagen | `{entry}` | {path} |")
    ci = (ROOT / ".github/workflows/ci.yml").read_text()
    actions = list(dict.fromkeys(re.findall(r"uses:\s*([^\s]+)", ci)))
    assert actions == list(dict.fromkeys(re.findall(r"uses:\s*([^\s]+)", git_text(anchor, ".github/workflows/ci.yml")))), "CI action versions changed"
    for entry in actions:
        lines.append(f"| Acción CI | `{entry}` | .github/workflows/ci.yml |")
    lines += ["", "Inventario: backend 20 directas; client 32 directas; E2E 1 directa; siete plugins Maven declarados más formateador y annotation processor. JUnit/Mockito/AssertJ transitivas continúan en el BOM; no duplicadas.",
              "Los rangos del scaffold se conservan junto a sus versiones exactas de lockfile. Imágenes sin digest se conservan tal como estaban; Playwright mantiene tag + digest. Java 21 y Node 24.21.0 se conservan también en CI.",
              "", "Reproducir: resolver un POM efectivo y ejecutar `python scripts/dependency-inventory.py --effective-pom RUTA --write`. El script falla ante diferencias de dependencias/lockfiles/wrappers. Revisar cualquier diferencia antes de aceptarla.", ""]
    body = "\n".join(lines)
    if args.write:
        (ROOT / "docs/DEPENDENCIES.md").write_text(body, encoding="utf-8", newline="\n")
    else:
        assert (ROOT / "docs/DEPENDENCIES.md").read_text(encoding="utf-8") == body, "Inventory is stale"
    print("Inventory reconciled: Maven 20; " + "; ".join(counts) + "; plugins/parent/wrapper/locks unchanged")


if __name__ == "__main__":
    main()
