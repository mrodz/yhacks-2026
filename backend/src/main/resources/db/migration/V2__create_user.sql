CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    school_id BIGINT NOT NULL,
    CONSTRAINT fk_users_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_users_school_id ON users(school_id);