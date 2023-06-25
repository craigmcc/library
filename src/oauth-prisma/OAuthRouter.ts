// oauth-prisma/OAuthRouter.ts

/**
 * Consolidation of routers for OAuth related authentication and authorization.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Router} from "express";

// Internal Modules ----------------------------------------------------------

import OAuthMeRouter from"./OAuthMeRouter";
import OAuthTokenRouter from "./OAuthTokenRouter";

// Public Classes ------------------------------------------------------------

export const OAuthRouter = Router({
    strict: true,
})

// Subordinate Routers -------------------------------------------------------

OAuthRouter.use("/me", OAuthMeRouter);
OAuthRouter.use("/token", OAuthTokenRouter);

export default OAuthRouter;
