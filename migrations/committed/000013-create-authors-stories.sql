--! Previous: sha1:6f87e77bb0ccdeea4470bbde6ab363f011819c43
--! Hash: sha1:31e0ac1ce33f19ce8acc010b23ff5309e8d6155d
--! Message: create-authors-stories

-- Create authors_stories table

-- Undo if rerunning
DROP TABLE IF EXISTS authors_stories;

-- Create table
CREATE TABLE authors_stories (
    author_id INTEGER NOT NULL,
    story_id INTEGER NOT NULL,
    principal BOOLEAN NOT NULL DEFAULT false
);

-- Create foreign key constraints
ALTER TABLE authors_stories ADD CONSTRAINT authors_stories_author_id_fkey
    FOREIGN KEY (author_id) REFERENCES authors (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE authors_stories ADD CONSTRAINT authors_stories_story_id_fkey
    FOREIGN KEY (story_id) REFERENCES stories (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
