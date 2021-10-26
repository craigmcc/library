--! Previous: sha1:8e4193bdebe5fcd4a14cfe889d857396c3ea60e1
--! Hash: sha1:6f87e77bb0ccdeea4470bbde6ab363f011819c43
--! Message: create-authors-series

-- Create authors_series table

-- Undo if rerunning
DROP TABLE IF EXISTS authors_series;

-- Create table
CREATE TABLE authors_series (
    author_id INTEGER NOT NULL,
    series_id INTEGER NOT NULL,
    principal BOOLEAN NOT NULL DEFAULT false
);

-- Create foreign key constraints
ALTER TABLE authors_series ADD CONSTRAINT authors_series_author_id_fkey
    FOREIGN KEY (author_id) REFERENCES authors (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE authors_series ADD CONSTRAINT authors_series_series_id_fkey
    FOREIGN KEY (series_id) REFERENCES series (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
