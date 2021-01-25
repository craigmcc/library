// server --------------------------------------------------------------------

// Overall Express server for the Library Management application.

// External Modules ----------------------------------------------------------

require("custom-env").env(true);
export const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "production";
import { Orchestrator } from "@craigmcc/oauth-orchestrator";

// Internal Modules ----------------------------------------------------------

import Database from "./models/Database";
import MyOrchestratorHandlers from "./oauth/MyOrchestratorHandlers";
export const OAuthOrchestrator: Orchestrator
    = new Orchestrator(MyOrchestratorHandlers);
import ExpressApplication from "./routers/ExpressApplication";
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
ExpressApplication.listen(port, () => {
    logger.info({
        context: "Startup.express",
        msg: "Start Express Server",
        mode: `${NODE_ENV}`,
        port: `${port}`
    });
})
