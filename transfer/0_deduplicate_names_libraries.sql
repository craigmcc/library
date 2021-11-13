-- 0_deduplicate_volumes_libraries.sql -- Dedup story names if still duplicated
-- After a successful run this will report no updates if it is repeated

UPDATE stories SET name='Genesis DEDUP' where id=262 and name='Genesis';
UPDATE stories SET name='Dusty''s Diary Book 4 DEDUP' where id=271 and name='Dusty''s Diary Book 4';
UPDATE stories SET name='Invastion DEDUP' where id=276 and name='Invasion';
UPDATE stories SET name='Rift DEDUP' where id=278 and name='Rift';
UPDATE stories SET name='The Heirs of Earth DEDUP' where id=311 and name='The Heirs of Earth';
UPDATE stories SET name='Zero Day DEDUP' where id=140 and name='Zero Day';
UPDATE stories SET name='The Target DEDUP' where id=376 and name='The Target';
