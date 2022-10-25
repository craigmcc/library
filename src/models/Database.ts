/**
 * Configuration of the Sequelize models and database used by this application.
 * @packageDocumentation
 */

// Database ------------------------------------------------------------------

// External Modules ----------------------------------------------------------

require("custom-env").env(true);
import {Sequelize} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AccessToken from "./AccessToken";
import Author from "./Author";
import AuthorSeries from "./AuthorSeries";
import AuthorStory from "./AuthorStory";
import AuthorVolume from "./AuthorVolume";
import Library from "./Library";
import RefreshToken from "./RefreshToken";
import Series from "./Series";
import SeriesStory from "./SeriesStory";
import Story from "./Story";
import User from "./User";
import Volume from "./Volume";
import VolumeStory from "./VolumeStory";
import logger from "../util/ServerLogger";

// Configure Database Instance -----------------------------------------------

const DATABASE_URL = process.env.DATABASE_URL ? process.env.DATABASE_URL : "test";

/**
 * The completely configured Sequelize instance for use in service objects.
 * @public
 */
export const Database = new Sequelize(DATABASE_URL, {
    logging: false,
    pool: {
        acquire: 30000,
        idle: 10000,
        max: 5,
        min: 0
    }
});

Database.addModels([
    // Library Stack - Author FK messed up in tests if this is not before Author
    Library,
    Author,
    Series,
    Story,
    Volume,
    AuthorSeries,
    AuthorStory,
    AuthorVolume,
    SeriesStory,
    VolumeStory,
    // User Stack
    User,
    AccessToken,
    RefreshToken,
]);

logger.info({
    context: "Startup",
    msg: "Sequelize models initialized",
    dialect: `${Database.getDialect()}`,
    name: `${Database.getDatabaseName()}`,
});

export default Database;
