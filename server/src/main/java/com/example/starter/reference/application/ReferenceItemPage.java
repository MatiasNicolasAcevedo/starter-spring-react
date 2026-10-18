package com.example.starter.reference.application;

import java.util.List;

public record ReferenceItemPage(
        List<ReferenceItemView> content, int page, int size, long totalElements, int totalPages) {}
