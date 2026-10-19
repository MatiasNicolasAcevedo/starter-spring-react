package com.example.starter.reference.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReferenceItemRepository extends JpaRepository<ReferenceItem, UUID> {
    // Bind the long offset in PostgreSQL rather than JPA's int-only setFirstResult.
    @Query(value = """
                    SELECT * FROM reference_item WHERE owner_id = :ownerId
                    ORDER BY created_at DESC, id DESC LIMIT :rowLimit OFFSET :rowOffset
                    """, nativeQuery = true)
    List<ReferenceItem> findPageByOwnerId(
            @Param("ownerId") UUID ownerId, @Param("rowOffset") long offset, @Param("rowLimit") int size);

    long countByOwnerId(UUID ownerId);

    Optional<ReferenceItem> findByIdAndOwnerId(UUID id, UUID ownerId);
}
