--! Previous: sha1:7b423f3c504c82e87651f5d3196ca8d0fb8f9f3e
--! Hash: sha1:8c9a7c089a8e05d42147f42462516313ca59ab4a
--! Message: Add PK constraints on authors_xxx tables

-- Add primary key on authors_series, authors_stories, authors_volumes

-- Drop any previous leftover primary keys
ALTER TABLE authors_series DROP CONSTRAINT IF EXISTS authors_series_pkey;
ALTER TABLE authors_stories DROP CONSTRAINT IF EXISTS authors_stories_pkey;
ALTER TABLE authors_volumes DROP CONSTRAINT IF EXISTS authors_volumes_pkey;

-- Add missing primary keys
ALTER TABLE authors_series
  ADD CONSTRAINT authors_series_pkey PRIMARY KEY (author_id, series_id);

ALTER TABLE authors_stories
  ADD CONSTRAINT authors_stories_pkey PRIMARY KEY (author_id, story_id);

ALTER TABLE authors_volumes
  ADD CONSTRAINT authors_volumes_pkey PRIMARY KEY (author_id, volume_id);
