ALTER TABLE users
    ADD COLUMN sub                UUID UNIQUE,
    ADD COLUMN preferred_username VARCHAR(255),
    ADD COLUMN website            VARCHAR(255),
    ADD COLUMN phone_number       VARCHAR(50),
    ADD COLUMN nickname           VARCHAR(255);
