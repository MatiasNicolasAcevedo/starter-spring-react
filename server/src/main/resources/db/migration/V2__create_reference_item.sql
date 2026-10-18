-- Removable private example (S-003). Existing migrations remain immutable.
CREATE TABLE reference_item (
    id UUID NOT NULL PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES app_user(id),
    title VARCHAR(120) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT ck_reference_title CHECK (title = btrim(title) AND char_length(title) BETWEEN 1 AND 120),
    CONSTRAINT ck_reference_description CHECK (description = btrim(description) AND char_length(description) <= 2000)
);
CREATE INDEX ix_reference_owner_created_id ON reference_item (owner_id, created_at DESC, id DESC);
