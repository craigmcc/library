-- 4_reset_sequences_library -- Reset id sequences in "library" database after load.

SELECT setval(pg_get_serial_sequence('authors', 'id'),
              COALESCE(max(id) + 1, 1), false)
FROM authors;

SELECT setval(pg_get_serial_sequence('libraries', 'id'),
              COALESCE(max(id) + 1, 1), false)
FROM libraries;

SELECT setval(pg_get_serial_sequence('series', 'id'),
              COALESCE(max(id) + 1, 1), false)
FROM series;

SELECT setval(pg_get_serial_sequence('stories', 'id'),
              COALESCE(max(id) + 1, 1), false)
FROM stories;

SELECT setval(pg_get_serial_sequence('users', 'id'),
              COALESCE(max(id) + 1, 1), false)
FROM users;

SELECT setval(pg_get_serial_sequence('volumes', 'id'),
              COALESCE(max(id) + 1, 1), false)
FROM volumes;

