// Database ------------------------------------------------------------------

// Set up database integration and return a configured Sequelize object.

// External Modules ----------------------------------------------------------

import { Sequelize } from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AccessToken from "./AccessToken";
import Author from "./Author";
import AuthorVolume from "./AuthorVolume";
import Library from "./Library";
import RefreshToken from "./RefreshToken";
import User from "./User";
import Volume from "./Volume";

// Configure Database Instance -----------------------------------------------

const DB_DB: string = process.env.DB_DB || "";
const DB_HOST: string = process.env.DB_HOST || "";
const DB_PASSWORD: string = process.env.DB_PASSWORD || "";
const DB_POOL_ACQUIRE: string = process.env.DB_POOL_ACQUIRE || "30000";
const DB_POOL_IDLE: string = process.env.DB_POOL_ACQUIRE || "10000";
const DB_POOL_MAX: string = process.env.DB_POOL_ACQUIRE || "5";
const DB_POOL_MIN: string = process.env.DB_POOL_ACQUIRE || "0";
const DB_USER: string = process.env.DB_USER || "";

export const Database = ((process.env.NODE_ENV !== "test")
        ? new Sequelize(DB_DB, DB_USER, DB_PASSWORD, {
            dialect: "postgres",
            host: DB_HOST,
            logging: false, // or a Pino logger
            pool: {
                acquire: parseInt(DB_POOL_ACQUIRE),
                idle: parseInt(DB_POOL_IDLE),
                max: parseInt(DB_POOL_MAX),
                min: parseInt(DB_POOL_MIN),
            }
        })
        : new Sequelize("database", "username", "password", {
            dialect: "sqlite",
            logging: false, // or a Pino logger
            storage: "./test/database.sqlite",
        })
);

Database.addModels([
    AccessToken,
    Author,
    AuthorVolume,
    Library,
    RefreshToken,
    User,
    Volume,
]);

export default Database;
