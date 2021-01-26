// DevModeRouters ------------------------------------------------------------

// Consolidate Routers for Development Mode REST APIs.

// External Modules ----------------------------------------------------------

import { Router } from "express";

// Internal Modules ----------------------------------------------------------

import ImportRouter from "./ImportRouter";

// Public Objects ------------------------------------------------------------

const DevModeRouters = Router({
    strict: true
});

DevModeRouters.use("/import", ImportRouter);

export default DevModeRouters;
