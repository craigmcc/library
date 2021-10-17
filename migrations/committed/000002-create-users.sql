--! Previous: sha1:73dd51c0091406d1bcb08fa10b3f83c22ea6ee06
--! Hash: sha1:f8bd5325f5eb617a2ea396c332f8b654e7cabf10
--! Message: create-users

-- Create users table

-- Undo if rerunning
DROP TABLE IF EXISTS users;

-- Create table
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    name            TEXT NOT NULL,
    password        TEXT NOT NULL,
    scope           TEXT NOT NULL,
    username        TEXT NOT NULL
);

-- Create unique index on username
CREATE UNIQUE INDEX uk_users_username ON users (username);
