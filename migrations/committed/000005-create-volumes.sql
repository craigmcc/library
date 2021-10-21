--! Previous: sha1:d7c124b9b0c02f21a667c1df8a5bd7ddbb8fe3be
--! Hash: sha1:0804c03e947128196bd08334e55d1363d1c4c7c2
--! Message: create-volumes

-- Create volumes table

-- Undo if rerunning
DROP TABLE IF EXISTS volumes;

-- Create table
CREATE TABLE volumes (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    copyright       TEXT NULL,
    google_id       TEXT NULL,
    isbn            TEXT null,
    library_id      INTEGER NOT NULL,
    location        TEXT NULL,
    name            TEXT NOT NULL,
    notes           TEXT NULL,
    read            BOOLEAN NOT NULL DEFAULT FALSE,
    type            TEXT NOT NULL
);

-- Create unique index
CREATE UNIQUE INDEX uk_volumes_library_id_name ON volumes (library_id, name);

-- Create foreign key constraint
ALTER TABLE volumes ADD CONSTRAINT volumes_library_id_fkey
    FOREIGN KEY (library_id) REFERENCES libraries (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
