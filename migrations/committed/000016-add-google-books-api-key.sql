--! Previous: sha1:8c9a7c089a8e05d42147f42462516313ca59ab4a
--! Hash: sha1:3a31a88f3fe2121b36b0f80e3820c0637ae9a2c5
--! Message: add-google-books-api-key

-- Add google_books_api_key to users table

-- Create column
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS
    google_books_api_key TEXT NULL;
