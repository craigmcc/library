// ExpressApplication --------------------------------------------------------

// Overall Express application Router.

// External Modules ----------------------------------------------------------

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
const rfs = require("rotating-file-stream");

// Internal Modules ----------------------------------------------------------

import ApiRouters from "./ApiRouters";
import DevModeRouters from "./DevModeRouters";
import OAuthRouters from "./OAuthRouters";
import { handleOAuthError } from "../oauth/MyMiddleware";
import logger from "../util/server-logger";
import {
    handleHttpError,
    handleServerError,
    handleValidationError
} from "../util/middleware";
import { toLocalISO } from "../util/timestamps";

const MORGAN_FORMAT_PROD = ":remote-addr -"
    + " :req[X-CTG-Username]"
    + " [:timestamp]"
    + " \":method :url\""
    + " :status :res[content-length]";
const MORGAN_FORMAT_DEV = MORGAN_FORMAT_PROD + " \":req[Authorization]\"";

// Public Objects ------------------------------------------------------------

const app = express();

// Configure global middleware
app.use(cors({
    origin: "*"
}));

// Configure access log management
morgan.token("timestamp",
    (req, res): string =>
    {
        return toLocalISO(new Date());
    });
if (process.env.NODE_ENV === "development") {
    app.use(morgan(MORGAN_FORMAT_DEV));
} else {
    const LOG_DIRECTORY =
        process.env.LOG_DIRECTORY ? process.env.LOG_DIRECTORY : "./log";
    const accessLogStream = rfs.createStream("access.log", {
        interval: "1d",
        path: path.resolve(LOG_DIRECTORY),
    });
    app.use(morgan(MORGAN_FORMAT_PROD, {
        stream: accessLogStream
    }));
}

// Configure body handling middleware
app.use(bodyParser.json({
}));
app.use(bodyParser.text({
    limit: "2mb",
    type: "text/csv",
}));
app.use(bodyParser.urlencoded({
    extended: true,
}));

// Configure static file routing
const CLIENT_BASE: string = path.resolve("./") + "/client/build";
logger.info({
    context: "Startup.static",
    msg: "Setup Static File Handling",
    path: `${CLIENT_BASE}`
});
app.use(express.static(CLIENT_BASE));

// Configure application-specific and OAuth-specific routing
app.use("/api", ApiRouters);
app.use("/devmode", DevModeRouters);
app.use("/oauth", OAuthRouters);

// Configure error handling (must be last)
app.use(handleHttpError);
app.use(handleValidationError);
app.use(handleOAuthError);
app.use(handleServerError); // The last of the last :-)

// Configure unknown mappings back to client
app.get("*", (req, res) => {
    res.sendFile(CLIENT_BASE + "/index.html");
})

export default app;
