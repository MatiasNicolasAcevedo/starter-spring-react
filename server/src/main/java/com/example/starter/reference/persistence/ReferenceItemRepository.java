package com.example.starter.reference.persistence;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReferenceItemRepository extends JpaRepository<ReferenceItem, UUID> {
    Page<ReferenceItem> findAllByOwnerId(UUID ownerId, Pageable pageable);

    Optional<ReferenceItem> findByIdAndOwnerId(UUID id, UUID ownerId);
}
