-- 2_truncate_library.sql
-- NOTE: CASCADE will deal with dependency tables.

TRUNCATE users CASCADE;
TRUNCATE libraries CASCADE;
