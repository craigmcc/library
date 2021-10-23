--! Previous: sha1:09fd75bef4ef00f13cc03c70d8f6a548030df498
--! Hash: sha1:2e6ca2df6d9ba3b0e6134a1dbec2f96ac9a37e35
--! Message: create-series

-- Create series table

-- Undo if rerunning
DROP TABLE IF EXISTS series;

-- Create table

CREATE TABLE series (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    copyright       TEXT NULL,
    library_id      INTEGER NOT NULL,
    name            TEXT NOT NULL,
    notes           TEXT NULL
);

-- Create unique index
CREATE UNIQUE INDEX series_library_id_name_key ON series (library_id, name);

-- Create foreign key constraint
ALTER TABLE series ADD CONSTRAINT series_library_id_fkey
    FOREIGN KEY (library_id) REFERENCES libraries (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
