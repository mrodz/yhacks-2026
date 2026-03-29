ALTER TABLE contract_analyses
    DROP COLUMN IF EXISTS summary,
    DROP COLUMN IF EXISTS risk_level,
    DROP COLUMN IF EXISTS parties,
    DROP COLUMN IF EXISTS key_terms,
    DROP COLUMN IF EXISTS obligations,
    DROP COLUMN IF EXISTS red_flags,
    DROP COLUMN IF EXISTS steps,
    ADD COLUMN IF NOT EXISTS analysis JSONB;
