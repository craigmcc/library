--! Previous: sha1:2e6ca2df6d9ba3b0e6134a1dbec2f96ac9a37e35
--! Hash: sha1:cee4ccd5668d94b6063561965f4eeeec80e6fa21
--! Message: create-authors

-- Create authors table

-- Undo if rerunning
DROP TABLE IF EXISTS authors;

-- Create table

CREATE TABLE authors (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    library_id      INTEGER NOT NULL,
    notes           TEXT NULL
);

-- Create unique index
CREATE UNIQUE INDEX stories_library_id_last_name_first_name_key ON authors (library_id, last_name, first_name);

-- Create foreign key constraint
ALTER TABLE authors ADD CONSTRAINT authors_library_id_fkey
    FOREIGN KEY (library_id) REFERENCES libraries (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
