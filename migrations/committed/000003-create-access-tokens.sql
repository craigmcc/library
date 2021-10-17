--! Previous: sha1:f8bd5325f5eb617a2ea396c332f8b654e7cabf10
--! Hash: sha1:a4386b2925f681c69fb75c823104d3838fe3c20a
--! Message: create-access-tokens

-- Create access_tokens table

-- Undo if rerunning
DROP TABLE IF EXISTS access_tokens;

-- Create table
CREATE TABLE access_tokens (
    id              SERIAL PRIMARY KEY,
    expires         TIMESTAMP WITH TIME ZONE NOT NULL,
    scope           TEXT NOT NULL,
    token           TEXT NOT NULL,
    user_id         INTEGER NOT NULL
);

-- Create unique index
CREATE UNIQUE INDEX access_tokens_token_key ON access_tokens (token);

-- Create foreign key constraint
ALTER TABLE access_tokens ADD CONSTRAINT access_tokens_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
