--! Previous: sha1:d815e2c3abcab805ef6393c522681ae4c3057788
--! Hash: sha1:8e4193bdebe5fcd4a14cfe889d857396c3ea60e1
--! Message: add-series-stories-ordinal

-- Add ordinal to series_stories

ALTER TABLE series_stories
  ADD COLUMN IF NOT EXISTS ordinal INTEGER NULL;
