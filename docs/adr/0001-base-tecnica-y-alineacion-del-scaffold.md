# ADR 0001 · Base técnica y alineación del scaffold

- **Estado:** decisión vigente; pruebas y evidencia por aplicación.
- **Ámbito:** starter genérico y futura adopción, sin dominio de negocio.

## Contexto
Java 21 LTS prevalece sobre defaults del generador. PostgreSQL de desarrollo e integración deben usar la misma imagen fija; nunca latest. Las actualizaciones requieren una tarea explícita.

## Decisión
- **Java 21** (`java.version=21`), Temurin `21.0.12_8` en imágenes de build/runtime/tests. La decisión confirmada del dueño prevalece sobre el default del generador; Java 25 queda como posible actualización futura en tarea propia.
- **Conservar** Spring Boot 4.1.1, Maven Wrapper 3.3.4 (Maven 3.10.0), los starters modulares de Boot 4 y Testcontainers 2.0.5 gestionados por el BOM. Paquete inicial `com.example.starter`.
- **springdoc-openapi 3.1.1** conservado junto al BOM de Boot 4.
- **PostgreSQL `postgres:18.6`** en Compose y Testcontainers (misma imagen; docs-check lo verifica). Volumen en `/var/lib/postgresql` según la imagen oficial de 18+.
- **Calidad de build:** Spotless con palantir-java-format (único formateador, `check` en `verify`), Failsafe para `*IT`, JaCoCo con datos unit+IT combinados y `check` con umbrales efectivos por paquete en el POM (referencia 80% líneas/70% ramas; ver [TESTING.md](../TESTING.md#cobertura-y-seguridad)), Mockito como agente Java (JDK 21+).
- **Zona horaria:** JVM con `-Duser.timezone=UTC` en runtime y pruebas; instantes en `TIMESTAMPTZ`.
- **Identificadores:** UUID v7 generados por Hibernate (`@UuidGenerator(style = VERSION_7)`), no enumerables y ordenables por tiempo.
- **Pruebas backend en contenedor:** el runner `server-tests` monta el socket de Docker y usa `TESTCONTAINERS_HOST_OVERRIDE=host.docker.internal`; la alternativa host requiere JDK 21 y las mismas suites, con causa documentada.

## Alternativas consideradas
- Mantener Java 25: válido técnicamente, pero contradice una decisión confirmada y el JDK del host.
- `postgres:18.6-alpine`: imagen menor, pero musl/locales difieren de la imagen Debian; se prefirió la oficial por defecto.
- google-java-format o spring-javaformat: igualmente válidos; palantir ofrece 120 columnas y lectura cómoda con un único motor fijado.
- IDs `BIGINT` secuenciales: más simples, pero expuestos en URLs permiten enumerar; UUID v7 conserva orden temporal.

## Consecuencias
- Spotless aplica el formato único de Java.
- Toda imagen/versión nueva se fija explícitamente y se actualiza en una tarea con gate completo.
- La DB de desarrollo (volumen `starter_db-data`) y las de pruebas (contenedores efímeros) nunca se comparten.
