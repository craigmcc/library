--! Previous: sha1:0804c03e947128196bd08334e55d1363d1c4c7c2
--! Hash: sha1:09fd75bef4ef00f13cc03c70d8f6a548030df498
--! Message: create-stories

-- Create stories table

-- Undo if rerunning
DROP TABLE IF EXISTS stories;

-- Create table

CREATE TABLE stories (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    copyright       TEXT NULL,
    library_id      INTEGER NOT NULL,
    name            TEXT NOT NULL,
    notes           TEXT NULL
);

-- Create unique index
CREATE UNIQUE INDEX stories_library_id_name_key ON stories (library_id, name);

-- Create foreign key constraint
ALTER TABLE stories ADD CONSTRAINT stories_library_id_fkey
    FOREIGN KEY (library_id) REFERENCES libraries (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
