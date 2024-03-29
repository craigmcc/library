/**
 * The overall server application for the Library application.
 * @packageDocumentation
 */

// server --------------------------------------------------------------------

// External Modules ----------------------------------------------------------

import * as fs from "fs";

require("custom-env").env(true);
const https = require("https");

/**
 * The Node.JS environment we are running under.
 * @defaultValue "production"
 * @public
 */
export const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "production";

/**
 * The port on which to start an HTTP listener, if any.
 * @public
 */
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;

/**
 * The port on which to start an HTTPS listener, if any.
 * @public
 */
export const PORT_HTTPS = process.env.PORT_HTTPS ? parseInt(process.env.PORT_HTTPS, 10) : undefined;

// Internal Modules ----------------------------------------------------------

import Database from "./models/Database";
import ExpressApplication from "./routers/ExpressApplication";
import logger from "./util/ServerLogger";

// Configure Models and Associations -----------------------------------------

Database.getDatabaseName(); // Trigger initialization of Database module

// Configure and Start Server ------------------------------------------------

if (PORT) {
    ExpressApplication.listen(PORT, () => {
        logger.info({
            context: "Startup",
            msg: "Start HTTP Server",
            mode: NODE_ENV,
            port: PORT,
        });
    });
}

if (PORT_HTTPS && process.env.HTTPS_CERT && process.env.HTTPS_KEY) {
    https.createServer({
        cert: fs.readFileSync(process.env.HTTPS_CERT),
        key: fs.readFileSync(process.env.HTTPS_KEY),
    }, ExpressApplication).listen(PORT_HTTPS, () => {
        logger.info({
            context: "Startup",
            msg: "Start HTTPS Server",
            mode: NODE_ENV,
            port: PORT_HTTPS,
        });
    });
}
