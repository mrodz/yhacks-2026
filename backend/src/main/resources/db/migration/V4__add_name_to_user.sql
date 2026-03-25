ALTER TABLE users 
ADD COLUMN name VARCHAR(255) NOT NULL,
ADD COLUMN personal_email VARCHAR(255);

ALTER TABLE users ADD CONSTRAINT uk_users_personal_email UNIQUE (personal_email);