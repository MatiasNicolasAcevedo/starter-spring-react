package com.example.starter.reference.application;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Set;
import java.util.regex.Pattern;
import tools.jackson.databind.JsonNode;

/** Normalization matches ECMAScript trim used by the client; lengths use UTF-16 in both validators. */
public record ReferenceItemInput(
        @NotBlank(message = "Ingresá un título.") @Size(max = 120, message = "Usá hasta 120 caracteres.") String title,

        @NotNull(message = "Ingresá una descripción, aunque esté vacía.") @Size(max = 2000, message = "Usá hasta 2000 caracteres.") String description) {
    private static final Pattern EDGES = Pattern.compile(
            "^[\\x09-\\x0D\\x20\\u00A0\\u1680\\u2000-\\u200A\\u2028\\u2029\\u202F\\u205F\\u3000\\uFEFF]+|"
                    + "[\\x09-\\x0D\\x20\\u00A0\\u1680\\u2000-\\u200A\\u2028\\u2029\\u202F\\u205F\\u3000\\uFEFF]+$");

    public ReferenceItemInput {
        title = trim(title);
        description = trim(description);
    }

    /** Feature-scoped shape validation: no global mapper changes or scalar-to-string coercion. */
    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    public static ReferenceItemInput fromJson(JsonNode body) {
        if (!body.isObject()
                || body.propertyStream()
                        .anyMatch(entry -> !Set.of("title", "description").contains(entry.getKey()))) {
            throw new IllegalArgumentException("Solicitud inválida.");
        }
        return new ReferenceItemInput(string(body.get("title")), string(body.get("description")));
    }

    private static String string(JsonNode value) {
        if (value == null || value.isNull()) return null;
        if (!value.isString()) throw new IllegalArgumentException("Solicitud inválida.");
        return value.asString();
    }

    private static String trim(String value) {
        return value == null ? null : EDGES.matcher(value).replaceAll("");
    }
}
