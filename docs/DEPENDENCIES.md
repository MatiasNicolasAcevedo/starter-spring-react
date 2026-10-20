# DEPENDENCIES · Inventario conciliado

Versiones congeladas; sin actualizaciones a latest. El inventario describe la base actual.
Generado con POM efectivo (Maven) y lockfiles npm; no se documentan transitivas como directas.
Comparación con la referencia Git seleccionada: coordenadas/versiones/scopes, plugins, parent, propiedades, wrappers y resolución npm.

## Backend

| Coordenada | Declarada | Resuelta | Scope | Función / fuente |
|---|---|---|---|---|
| org.springframework.boot:spring-boot-starter-parent | 4.1.1 | 4.1.1 | parent/BOM | Gestión del stack · server/pom.xml |
| org.springframework.boot:spring-boot-starter-actuator | `BOM` | 4.1.1 | compile | Runtime backend · server/pom.xml |
| org.springframework.boot:spring-boot-starter-data-jpa | `BOM` | 4.1.1 | compile | Runtime backend · server/pom.xml |
| org.springframework.boot:spring-boot-starter-flyway | `BOM` | 4.1.1 | compile | Runtime backend · server/pom.xml |
| org.springframework.boot:spring-boot-starter-security | `BOM` | 4.1.1 | compile | Runtime backend · server/pom.xml |
| org.springframework.boot:spring-boot-starter-security-oauth2-client | `BOM` | 4.1.1 | compile | Runtime backend · server/pom.xml |
| org.springframework.boot:spring-boot-starter-validation | `BOM` | 4.1.1 | compile | Runtime backend · server/pom.xml |
| org.springframework.boot:spring-boot-starter-webmvc | `BOM` | 4.1.1 | compile | Runtime backend · server/pom.xml |
| org.flywaydb:flyway-database-postgresql | `BOM` | 12.4.0 | compile | Runtime backend · server/pom.xml |
| org.springdoc:springdoc-openapi-starter-webmvc-ui | `${springdoc.version}` | 3.1.1 | compile | Runtime backend · server/pom.xml |
| org.postgresql:postgresql | `BOM` | 42.7.13 | runtime | Runtime backend · server/pom.xml |
| org.springframework.boot:spring-boot-starter-actuator-test | `BOM` | 4.1.1 | test | Pruebas · server/pom.xml |
| org.springframework.boot:spring-boot-starter-data-jpa-test | `BOM` | 4.1.1 | test | Pruebas · server/pom.xml |
| org.springframework.boot:spring-boot-starter-flyway-test | `BOM` | 4.1.1 | test | Pruebas · server/pom.xml |
| org.springframework.boot:spring-boot-starter-security-oauth2-client-test | `BOM` | 4.1.1 | test | Pruebas · server/pom.xml |
| org.springframework.boot:spring-boot-starter-security-test | `BOM` | 4.1.1 | test | Pruebas · server/pom.xml |
| org.springframework.boot:spring-boot-starter-validation-test | `BOM` | 4.1.1 | test | Pruebas · server/pom.xml |
| org.springframework.boot:spring-boot-starter-webmvc-test | `BOM` | 4.1.1 | test | Pruebas · server/pom.xml |
| org.springframework.boot:spring-boot-testcontainers | `BOM` | 4.1.1 | test | Pruebas · server/pom.xml |
| org.testcontainers:testcontainers-junit-jupiter | `BOM` | 2.0.5 | test | Pruebas · server/pom.xml |
| org.testcontainers:testcontainers-postgresql | `BOM` | 2.0.5 | test | Pruebas · server/pom.xml |

## Plugins y herramientas Maven

| Coordenada | Declarada | Efectiva | Función / fuente |
|---|---|---|---|
| org.springframework.boot:spring-boot-maven-plugin | `BOM/parent` | 4.1.1 | Build/calidad · server/pom.xml |
| org.apache.maven.plugins:maven-compiler-plugin | `BOM/parent` | 3.15.0 | Build/calidad · server/pom.xml |
| org.apache.maven.plugins:maven-dependency-plugin | `BOM/parent` | 3.10.0 | Build/calidad · server/pom.xml |
| org.apache.maven.plugins:maven-surefire-plugin | `BOM/parent` | 3.5.6 | Build/calidad · server/pom.xml |
| org.apache.maven.plugins:maven-failsafe-plugin | `BOM/parent` | 3.5.6 | Build/calidad · server/pom.xml |
| org.jacoco:jacoco-maven-plugin | `${jacoco.version}` | 0.8.15 | Build/calidad · server/pom.xml |
| com.diffplug.spotless:spotless-maven-plugin | `${spotless.version}` | 3.10.4 | Build/calidad · server/pom.xml |
| com.palantir.javaformat:palantir-java-format | ${palantir-java-format.version} | 2.102.0 | Formateador Spotless · server/pom.xml |
| org.springframework.boot:spring-boot-configuration-processor | BOM | 4.1.1 | Procesador de anotaciones del compiler · server/pom.xml |
| org.mockito:mockito-core | BOM | 5.23.0 | Agente Mockito (test; UTC en Surefire/Failsafe) · server/pom.xml |

## client

| Nombre | Declarada | Resuelta | Scope | Función / fuente |
|---|---|---|---|---|
| @emotion/react | 11.14.0 | 11.14.0 | dependencies | Runtime UI · client/package.json + package-lock.json |
| @emotion/styled | 11.14.1 | 11.14.1 | dependencies | Runtime UI · client/package.json + package-lock.json |
| @hookform/resolvers | 5.9.1 | 5.9.1 | dependencies | Runtime UI · client/package.json + package-lock.json |
| @mui/material | 9.5.0 | 9.5.0 | dependencies | Runtime UI · client/package.json + package-lock.json |
| @tanstack/react-query | 5.104.2 | 5.104.2 | dependencies | Runtime UI · client/package.json + package-lock.json |
| react | ^19.2.8 | 19.3.0 | dependencies | Runtime UI · client/package.json + package-lock.json |
| react-dom | ^19.2.8 | 19.3.0 | dependencies | Runtime UI · client/package.json + package-lock.json |
| react-hook-form | 7.90.0 | 7.90.0 | dependencies | Runtime UI · client/package.json + package-lock.json |
| react-router | 8.4.0 | 8.4.0 | dependencies | Runtime UI · client/package.json + package-lock.json |
| zod | 4.6.7 | 4.6.7 | dependencies | Runtime UI · client/package.json + package-lock.json |
| @eslint/js | ^10.0.1 | 10.0.1 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| @testing-library/dom | 10.4.2 | 10.4.2 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| @testing-library/jest-dom | 7.0.1 | 7.0.1 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| @testing-library/react | 16.3.3 | 16.3.3 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| @testing-library/user-event | 14.6.7 | 14.6.7 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| @types/node | ^24.13.3 | 24.19.2 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| @types/react | ^19.2.18 | 19.3.0 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| @types/react-dom | ^19.2.7 | 19.3.0 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| @vitejs/plugin-react | ^6.1.1 | 6.1.2 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| @vitest/coverage-v8 | 5.0.4 | 5.0.4 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| eslint | ^10.10.0 | 10.12.0 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| eslint-config-prettier | 10.1.8 | 10.1.8 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| eslint-plugin-react-hooks | ^7.1.1 | 7.1.1 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| eslint-plugin-react-refresh | ^0.5.6 | 0.5.7 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| globals | ^17.12.0 | 17.13.0 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| jsdom | 30.1.2 | 30.1.2 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| msw | 3.0.3 | 3.0.3 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| prettier | 3.9.10 | 3.9.10 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| typescript | ~6.0.2 | 6.0.3 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| typescript-eslint | ^8.69.0 | 8.71.2 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| vite | ^8.3.0 | 8.3.4 | devDependencies | Build/pruebas · client/package.json + package-lock.json |
| vitest | 5.0.4 | 5.0.4 | devDependencies | Build/pruebas · client/package.json + package-lock.json |

## e2e

| Nombre | Declarada | Resuelta | Scope | Función / fuente |
|---|---|---|---|---|
| @playwright/test | 1.64.0 | 1.64.0 | devDependencies | Build/pruebas · e2e/package.json + package-lock.json |

## Wrappers, imágenes y acciones fijadas

| Entrada | Versión / referencia exacta | Fuente / función |
|---|---|---|
| Maven Wrapper | 3.3.4 / Maven 3.10.0 / only-script | server/.mvn/wrapper/maven-wrapper.properties, mvnw, mvnw.cmd |
| Imagen | `eclipse-temurin:21.0.12_8-jdk-noble` | server/Dockerfile |
| Imagen | `eclipse-temurin:21.0.12_8-jre-noble` | server/Dockerfile |
| Imagen | `node:24.21.0-alpine` | client/Dockerfile |
| Imagen | `nginx:1.30.5-alpine` | client/Dockerfile |
| Imagen | `mcr.microsoft.com/playwright:v1.64.0-noble@sha256:06a9939e57531807f8d5fd76ce44b53165ffb7d7501d87ab10e285c20b1e971f` | e2e/Dockerfile |
| Imagen | `postgres:18.6` | docker-compose.yml |
| Imagen | `eclipse-temurin:21.0.12_8-jdk-noble` | docker-compose.yml |
| Imagen | `node:24.21.0-alpine` | docker-compose.yml |
| Imagen | `ghcr.io/navikt/mock-oauth2-server:3.0.3` | compose.auth-test.yml |
| Acción CI | `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1` | .github/workflows/ci.yml |
| Acción CI | `actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1` | .github/workflows/ci.yml |
| Acción CI | `actions/setup-java@de7274f081f381c8f8158605e0321c36c376e2e6` | .github/workflows/ci.yml |
| Acción CI | `actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9` | .github/workflows/ci.yml |

Inventario: backend 20 directas; client 32 directas; E2E 1 directa; siete plugins Maven declarados más formateador y annotation processor. JUnit/Mockito/AssertJ transitivas continúan en el BOM; no duplicadas.
Los rangos del scaffold se conservan junto a sus versiones exactas de lockfile. Imágenes sin digest se conservan tal como estaban; Playwright mantiene tag + digest. Java 21 y Node 24.21.0 se conservan también en CI.

Reproducir: resolver un POM efectivo y ejecutar `python scripts/dependency-inventory.py --effective-pom RUTA --write`. El script falla ante diferencias de dependencias/lockfiles/wrappers. Revisar cualquier diferencia antes de aceptarla.
