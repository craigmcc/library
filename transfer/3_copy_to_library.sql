-- 3_copy_to_library.sql -- Copy data to "library" database from CSV files.

-- Old users table does not have name column, so finesse it
ALTER TABLE users ALTER COLUMN name DROP NOT NULL;
\copy users (id, active, password, scope, username) FROM 'users.csv' CSV;
UPDATE users SET name=username;
ALTER TABLE users ALTER COLUMN name SET NOT NULL;

-- Remaining tables can be copied in top-down order
\copy libraries (id, active, name, notes, scope) FROM 'libraries.csv' CSV;
\copy authors (id, active, first_name, last_name, library_id, notes) FROM 'authors.csv' CSV;
\copy series (id, active, copyright, library_id, name, notes) FROM 'series.csv' CSV;
\copy stories (id, active, copyright, library_id, name, notes) FROM 'stories.csv' CSV;
\copy volumes (id, active, copyright, google_id, isbn, library_id, location, name, notes, read, type) FROM 'volumes.csv' CSV;

-- Do the join tables last
\copy authors_series (author_id, series_id, principal) FROM 'authors_series.csv' CSV;
\copy authors_stories (author_id, story_id, principal) FROM 'authors_stories.csv' CSV;
\copy authors_volumes (author_id, volume_id, principal) FROM 'authors_volumes.csv' CSV;
\copy series_stories (series_id, story_id, ordinal) FROM 'series_stories.csv' CSV;
\copy volumes_stories (story_id, volume_id) FROM 'volumes_stories.csv' CSV;


