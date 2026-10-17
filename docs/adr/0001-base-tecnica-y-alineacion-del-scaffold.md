# ADR 0001 · Base técnica y alineación del scaffold

- **Estado:** decisión heredada vigente; implementación y suites conservadas, evidencia propia pendiente de revalidación.
- **Ámbito:** starter genérico y futura adopción, sin dominio de negocio.

## Contexto
Java 21 LTS prevalece sobre defaults del generador. PostgreSQL de desarrollo e integración deben usar la misma imagen fija; nunca latest. No se actualizan versiones durante extracción.

## Decisión
- **Java 21** (`java.version=21`), Temurin `21.0.12_8` en imágenes de build/runtime/tests. La decisión confirmada del dueño prevalece sobre el default del generador; Java 25 queda como posible actualización futura en tarea propia.
- **Conservar** Spring Boot 4.1.1, Maven Wrapper 3.3.4 (Maven 3.10.0), los starters modulares de Boot 4 y Testcontainers 2.0.5 gestionados por el BOM. Paquete neutral de la extracción `com.example.starter`.
- **springdoc-openapi 3.1.1** conservado junto al BOM de Boot 4.
- **PostgreSQL `postgres:18.6`** en Compose y Testcontainers (misma imagen; docs-check lo verifica). Volumen en `/var/lib/postgresql` según la imagen oficial de 18+.
- **Calidad de build:** Spotless con palantir-java-format (único formateador, `check` en `verify`), Failsafe para `*IT`, JaCoCo con datos unit+IT combinados y `check` con umbrales 0 en M0 (evaluar para referencia, ver [TESTING.md](../TESTING.md#cobertura)), Mockito como agente Java (JDK 21+).
- **Zona horaria:** JVM con `-Duser.timezone=UTC` en runtime y pruebas; instantes en `TIMESTAMPTZ`.
- **Identificadores:** UUID v7 generados por Hibernate (`@UuidGenerator(style = VERSION_7)`), no enumerables y ordenables por tiempo.
- **Pruebas backend en contenedor:** el runner `server-tests` monta el socket de Docker y usa `TESTCONTAINERS_HOST_OVERRIDE=host.docker.internal`; funcionó en Docker Desktop/Windows al primer intento, por lo que **no** se aplicó la alternativa preaprobada de host. Esa alternativa sigue disponible y documentada.

## Alternativas consideradas
- Mantener Java 25: válido técnicamente, pero contradice una decisión confirmada y el JDK del host.
- `postgres:18.6-alpine`: imagen menor, pero musl/locales difieren de la imagen Debian; se prefirió la oficial por defecto.
- google-java-format o spring-javaformat: igualmente válidos; palantir ofrece 120 columnas y lectura cómoda con un único motor fijado.
- IDs `BIGINT` secuenciales: más simples, pero expuestos en URLs permiten enumerar; UUID v7 conserva orden temporal.

## Consecuencias
- El código generado se reformateó con Spotless (cambia indentación de tabs a espacios en Java).
- Toda imagen/versión nueva se fija explícitamente y se actualiza en una tarea con gate completo.
- La DB de desarrollo (volumen `starter_db-data`) y las de pruebas (contenedores efímeros) nunca se comparten.
