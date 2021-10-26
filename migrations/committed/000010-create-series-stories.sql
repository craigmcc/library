--! Previous: sha1:c1004f8bd4a0faa3044523b555940dbd6af43024
--! Hash: sha1:d815e2c3abcab805ef6393c522681ae4c3057788
--! Message: create-series-stories

-- Create series_stories table

-- Undo if rerunning
DROP TABLE IF EXISTS series_stories;

-- Create Table
CREATE TABLE series_stories (
    series_id  INTEGER NOT NULL,
    story_id INTEGER NOT NULL,
    PRIMARY KEY (series_id, story_id)
);

-- Create foreign key constraints
ALTER TABLE series_stories ADD CONSTRAINT series_stories_series_id_fkey
    FOREIGN KEY (series_id) REFERENCES series (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE series_stories ADD CONSTRAINT series_stories_story_id_fkey
    FOREIGN KEY (story_id) REFERENCES stories (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
