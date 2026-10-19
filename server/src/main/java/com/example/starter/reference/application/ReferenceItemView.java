package com.example.starter.reference.application;

import com.example.starter.reference.persistence.ReferenceItem;
import java.time.Instant;
import java.util.UUID;

/** Explicit boundary: the owner and the persistence entity never cross the HTTP API. */
public record ReferenceItemView(UUID id, String title, String description, Instant createdAt, Instant updatedAt) {
    static ReferenceItemView from(ReferenceItem item) {
        return new ReferenceItemView(
                item.getId(), item.getTitle(), item.getDescription(), item.getCreatedAt(), item.getUpdatedAt());
    }
}
