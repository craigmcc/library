// OAuthRouters --------------------------------------------------------------

// Consolidate Routers for OAuth endpoints.

// External Modules ----------------------------------------------------------

import { Router } from "express";

// Internal Modules ----------------------------------------------------------

import TokenRouter from "../oauth/TokenRouter";

// Public Objects ------------------------------------------------------------

const OAuthRouters = Router({
    strict: true
});

// Subject-Specific Routers --------------------------------------------------

OAuthRouters.use("/token", TokenRouter);

export default OAuthRouters;
