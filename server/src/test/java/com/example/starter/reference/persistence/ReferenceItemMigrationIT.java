package com.example.starter.reference.persistence;

import static org.assertj.core.api.Assertions.assertThat;

import java.sql.DriverManager;
import java.time.Instant;
import java.util.UUID;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@Testcontainers
class ReferenceItemMigrationIT {
    @Container
    static final PostgreSQLContainer POSTGRES = new PostgreSQLContainer("postgres:18.6");

    @Test
    void migratesEmptyAndExistingV1SchemasWithoutChangingIdentityOrAppliedV1() throws Exception {
        for (boolean existing : new boolean[] {false, true}) {
            String schema = existing ? "reference_upgrade" : "reference_empty";
            var config = Flyway.configure()
                    .dataSource(POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword())
                    .schemas(schema);
            var id = UUID.randomUUID();
            var created = Instant.parse("2026-10-18T12:00:00Z");
            Integer checksum = null;
            if (existing) {
                var v1 = config.target("1").load();
                v1.migrate();
                checksum = v1.info().current().getChecksum();
                try (var connection = DriverManager.getConnection(
                                POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword());
                        var insert = connection.prepareStatement("INSERT INTO " + schema
                                + ".app_user(id,issuer,subject,created_at,updated_at) VALUES (?,?,?,?,?)")) {
                    insert.setObject(1, id);
                    insert.setString(2, "https://migration.example.invalid");
                    insert.setString(3, "fictitious");
                    insert.setTimestamp(4, java.sql.Timestamp.from(created));
                    insert.setTimestamp(5, java.sql.Timestamp.from(created));
                    insert.executeUpdate();
                }
            }
            var all = config.target("latest").load();
            all.migrate();
            var versioned = java.util.Arrays.stream(all.info().applied())
                    .filter(migration -> migration.getVersion() != null)
                    .toList();
            assertThat(versioned)
                    .extracting(migration -> migration.getVersion().toString())
                    .containsExactly("1", "2");
            assertThat(all.info().current().getVersion().toString()).isEqualTo("2");
            if (existing) assertThat(versioned.getFirst().getChecksum()).isEqualTo(checksum);
            try (var connection = DriverManager.getConnection(
                            POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword());
                    var statement = connection.createStatement()) {
                var items = statement.executeQuery("SELECT count(*) FROM " + schema + ".reference_item");
                items.next();
                assertThat(items.getInt(1)).isZero();
                items.close();
                var users = statement.executeQuery("SELECT id,created_at FROM " + schema + ".app_user");
                assertThat(users.next()).isEqualTo(existing);
                if (existing) {
                    assertThat(users.getObject(1, UUID.class)).isEqualTo(id);
                    assertThat(users.getTimestamp(2).toInstant()).isEqualTo(created);
                }
                users.close();
            }
        }
    }
}
