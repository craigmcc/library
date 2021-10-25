--! Previous: sha1:cee4ccd5668d94b6063561965f4eeeec80e6fa21
--! Hash: sha1:c1004f8bd4a0faa3044523b555940dbd6af43024
--! Message: create-volumes-stories

-- Create volumes_stories table

-- Undo if rerunning
DROP TABLE IF EXISTS volumes_stories;

-- Create Table
CREATE TABLE volumes_stories (
    story_id  INTEGER NOT NULL,
    volume_id INTEGER NOT NULL,
    PRIMARY KEY (volume_id, story_id)
);

-- Create foreign key constraints
ALTER TABLE volumes_stories ADD CONSTRAINT volumes_stories_story_id_fkey
    FOREIGN KEY (story_id) REFERENCES stories (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE volumes_stories ADD CONSTRAINT volumes_stories_volume_id_fkey
    FOREIGN KEY (volume_id) REFERENCES volumes (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
