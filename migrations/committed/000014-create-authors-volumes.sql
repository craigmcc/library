--! Previous: sha1:31e0ac1ce33f19ce8acc010b23ff5309e8d6155d
--! Hash: sha1:7b423f3c504c82e87651f5d3196ca8d0fb8f9f3e
--! Message: create-authors-volumes

-- Create authors_volumes table

-- Undo if rerunning
DROP TABLE IF EXISTS authors_volumes;

-- Create table
CREATE TABLE authors_volumes (
    author_id INTEGER NOT NULL,
    volume_id INTEGER NOT NULL,
    principal BOOLEAN NOT NULL DEFAULT false
);

-- Create foreign key constraints
ALTER TABLE authors_volumes ADD CONSTRAINT authors_volumes_author_id_fkey
    FOREIGN KEY (author_id) REFERENCES authors (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE authors_volumes ADD CONSTRAINT authors_volumes_volume_id_fkey
    FOREIGN KEY (volume_id) REFERENCES volumes (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
