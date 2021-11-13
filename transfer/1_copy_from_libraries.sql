-- 1_copy_from_libraries.sql -- Copy data from "libraries" database to CSV files.

\copy authors (id, active, first_name, last_name, library_id, notes) TO 'authors.csv' CSV;
\copy authors_series (author_id, series_id, principal) TO 'authors_series.csv' CSV;
\copy authors_stories (author_id, story_id, principal) TO 'authors_stories.csv' CSV;
\copy authors_volumes (author_id, volume_id, principal) TO 'authors_volumes.csv' CSV;
\copy libraries (id, active, name, notes, scope) TO 'libraries.csv' CSV;
\copy series (id, active, copyright, library_id, name, notes) TO 'series.csv' CSV;
\copy series_stories (series_id, story_id, ordinal) TO 'series_stories.csv' CSV;
\copy stories (id, active, copyright, library_id, name, notes) TO 'stories.csv' CSV;
\copy users (id, active, password, scope, username) TO 'users.csv' CSV;
\copy volumes (id, active, copyright, google_id, isbn, library_id, location, name, notes, read, type) TO 'volumes.csv' CSV;
\copy volumes_stories (story_id, volume_id) TO 'volumes_stories.csv' CSV;
