// server --------------------------------------------------------------------

// Overall Express server for the Library Management application.

// External Modules ----------------------------------------------------------

require("custom-env").env(true);
export const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "production";

// Internal Modules ----------------------------------------------------------

import Database from "./models/Database";
import logger from "./util/server-logger";

// Configure Database --------------------------------------------------------

logger.info({
    context: "Startup.database",
    msg: "Initialize Sequelize Models",
    dialect: `${Database.getDialect()}`
});

Database.sync({});

// Configure and Start Server ------------------------------------------------

const port = process.env.PORT ? parseInt(process.env.PORT) : 8081;
logger.info({
    context: "Startup.express",
    msg: "Start Express Server - TODO",
    mode: `${NODE_ENV}`,
    port: `${port}`
});
