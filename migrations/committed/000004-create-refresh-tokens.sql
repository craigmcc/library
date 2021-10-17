--! Previous: sha1:a4386b2925f681c69fb75c823104d3838fe3c20a
--! Hash: sha1:d7c124b9b0c02f21a667c1df8a5bd7ddbb8fe3be
--! Message: create-refresh-tokens

-- Create refresh_tokens table

-- Undo if rerunning
DROP TABLE IF EXISTS refresh_tokens;

-- Create table
CREATE TABLE refresh_tokens (
    id              SERIAL PRIMARY KEY,
    access_token    TEXT NOT NULL,
    expires         TIMESTAMP WITH TIME ZONE NOT NULL,
    token           TEXT NOT NULL,
    user_id         INTEGER NOT NULL
);

-- Create unique index
CREATE UNIQUE INDEX refresh_tokens_token_key ON refresh_tokens (token);

-- Create foreign key constraint
ALTER TABLE refresh_tokens ADD CONSTRAINT refresh_tokens_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
