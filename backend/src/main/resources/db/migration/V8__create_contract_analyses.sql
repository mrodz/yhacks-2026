CREATE TABLE contract_analyses (
    id          BIGSERIAL    PRIMARY KEY,
    upload_id   BIGINT       NOT NULL UNIQUE REFERENCES contract_uploads(id) ON DELETE CASCADE,
    summary     TEXT         NOT NULL,
    risk_level  VARCHAR(10)  NOT NULL,
    parties     JSONB        NOT NULL DEFAULT '[]',
    key_terms   JSONB        NOT NULL DEFAULT '[]',
    obligations JSONB        NOT NULL DEFAULT '[]',
    red_flags   JSONB        NOT NULL DEFAULT '[]',
    steps       JSONB        NOT NULL DEFAULT '[]',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
