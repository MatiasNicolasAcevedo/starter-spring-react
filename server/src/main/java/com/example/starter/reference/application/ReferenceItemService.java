package com.example.starter.reference.application;

import com.example.starter.reference.persistence.ReferenceItem;
import com.example.starter.reference.persistence.ReferenceItemRepository;
import java.time.Clock;
import java.util.Objects;
import java.util.UUID;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Every resource lookup filters by owner in persistence, including mutations; no global existence probe. */
@Service
@Transactional
public class ReferenceItemService {
    private final ReferenceItemRepository repository;
    private final Clock clock;

    public ReferenceItemService(ReferenceItemRepository repository, Clock clock) {
        this.repository = repository;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public ReferenceItemPage list(UUID owner, int page, int size) {
        Objects.requireNonNull(owner);
        if (page < 0 || size < 1 || size > 100) throw new IllegalArgumentException("Paginación inválida.");
        var pageable = PageRequest.of(page, size);
        var result = new PageImpl<>(
                repository.findPageByOwnerId(owner, pageable.getOffset(), size),
                pageable,
                repository.countByOwnerId(owner));
        return new ReferenceItemPage(
                result.map(ReferenceItemView::from).getContent(),
                page,
                size,
                result.getTotalElements(),
                result.getTotalPages());
    }

    @Transactional(readOnly = true)
    public ReferenceItemView get(UUID owner, UUID id) {
        return ReferenceItemView.from(owned(owner, id));
    }

    public ReferenceItemView create(UUID owner, ReferenceItemInput input) {
        Objects.requireNonNull(owner);
        return ReferenceItemView.from(
                repository.saveAndFlush(new ReferenceItem(owner, input.title(), input.description(), now())));
    }

    public ReferenceItemView update(UUID owner, UUID id, ReferenceItemInput input) {
        var item = owned(owner, id);
        item.update(input.title(), input.description(), now());
        return ReferenceItemView.from(repository.saveAndFlush(item));
    }

    public void delete(UUID owner, UUID id) {
        repository.delete(owned(owner, id));
        repository.flush();
    }

    private ReferenceItem owned(UUID owner, UUID id) {
        Objects.requireNonNull(owner);
        return repository.findByIdAndOwnerId(id, owner).orElseThrow(ReferenceItemNotFoundException::new);
    }

    private java.time.Instant now() {
        return clock.instant().truncatedTo(java.time.temporal.ChronoUnit.MICROS);
    }
}
