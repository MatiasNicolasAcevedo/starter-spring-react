package com.example.starter.reference.persistence;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.example.starter.TestcontainersConfiguration;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestcontainersConfiguration.class)
class ReferenceItemRepositoryIT {
    private static final Instant NOW = Instant.parse("2026-10-18T12:00:00Z");

    @Autowired
    private ReferenceItemRepository repository;

    @Autowired
    private JdbcTemplate jdbc;

    private UUID owner() {
        var id = UUID.randomUUID();
        jdbc.update(
                "INSERT INTO app_user(id,issuer,subject,created_at,updated_at) VALUES (?,?,?,?,?)",
                id,
                "https://reference.example.invalid",
                id.toString(),
                java.sql.Timestamp.from(NOW),
                java.sql.Timestamp.from(NOW));
        return id;
    }

    @Test
    void realPostgresFiltersCountsAndResourcesByOwnerWithStableTies() {
        var a = owner();
        var b = owner();
        var first = repository.saveAndFlush(new ReferenceItem(a, "Duplicado", "", NOW));
        var second = repository.saveAndFlush(new ReferenceItem(a, "Duplicado", "", NOW));
        repository.saveAndFlush(new ReferenceItem(b, "Ajeno", "", NOW.plusSeconds(60)));
        assertThat(first.getId().version()).isEqualTo(7);
        var expected = jdbc.queryForList(
                "SELECT id FROM reference_item WHERE owner_id=? ORDER BY created_at DESC,id DESC", UUID.class, a);
        var page = repository.findPageByOwnerId(a, 0L, 1);
        assertThat(repository.countByOwnerId(a)).isEqualTo(2);
        assertThat(repository.countByOwnerId(b)).isEqualTo(1);
        assertThat(repository.countByOwnerId(UUID.randomUUID())).isZero();
        assertThat(page).extracting(ReferenceItem::getId).containsExactly(expected.getFirst());
        assertThat(repository.findPageByOwnerId(a, 1L, 1))
                .extracting(ReferenceItem::getId)
                .containsExactly(expected.getLast());
        for (long offset : new long[] {10L, Integer.MAX_VALUE, (long) Integer.MAX_VALUE + 1, 214748364700L}) {
            assertThat(repository.findPageByOwnerId(a, offset, 1)).isEmpty();
            assertThat(repository.countByOwnerId(a)).isEqualTo(2);
        }
        assertThat(repository.findByIdAndOwnerId(first.getId(), b)).isEmpty();
        assertThat(repository.findByIdAndOwnerId(UUID.randomUUID(), b)).isEmpty();
        assertThat(repository.findByIdAndOwnerId(first.getId(), a)).isPresent();
        assertThat(second.getCreatedAt()).isEqualTo(NOW);
    }

    @Test
    void databaseRejectsMissingOwner() {
        assertThatThrownBy(() -> repository.saveAndFlush(new ReferenceItem(UUID.randomUUID(), "Título", "", NOW)))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void databaseRejectsBlankUntrimmedAndOversizedValuesAndProtectsIdentity() {
        var owner = owner();
        var id = UUID.randomUUID();
        // Savepoints let each real constraint reject independently without reusing an aborted transaction.
        for (String title : new String[] {"", " ", " título", "x".repeat(121)}) {
            jdbc.execute("SAVEPOINT reference_invalid");
            assertThatThrownBy(() -> jdbc.update(
                            "INSERT INTO reference_item VALUES (?,?,?,?,?,?)",
                            id,
                            owner,
                            title,
                            "",
                            java.sql.Timestamp.from(NOW),
                            java.sql.Timestamp.from(NOW)))
                    .isInstanceOf(DataIntegrityViolationException.class);
            jdbc.execute("ROLLBACK TO SAVEPOINT reference_invalid");
        }
        repository.saveAndFlush(new ReferenceItem(owner, "Válido", "", NOW));
        jdbc.execute("SAVEPOINT reference_owner");
        assertThatThrownBy(() -> jdbc.update("DELETE FROM app_user WHERE id=?", owner))
                .isInstanceOf(DataIntegrityViolationException.class);
        jdbc.execute("ROLLBACK TO SAVEPOINT reference_owner");
        assertThat(repository.count()).isEqualTo(1);
    }
}
