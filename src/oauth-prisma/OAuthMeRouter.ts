// oauth-prisma/OAuthMeRouter.ts

/**
 * Express routes for dealing with the logged-in User's profile.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma, User} from "@prisma/client";
import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {requireUser} from "./OAuthMiddleware";
import * as UserActions from "../actions/UserActions";
import {BadRequest, Forbidden} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

export const OAuthMeRouter = Router({
    strict: true,
});

/**
 * Retrieve the authenticated User's profile.
 */
OAuthMeRouter.get("/",
    requireUser,
    async (req: Request, res: Response) => {
        if (res.locals.user) {
            const user: User = res.locals.user;
            user.password = "";
            res.send(user);
        } else {
            throw new BadRequest(
                "OAuthMeRouter.get",
                "Missing User information",
            );
        }
    });

/**
 * Update the authenticated User's profile (with restrictions).
 */
OAuthMeRouter.put("/",
    requireUser,
    async (req: Request, res: Response) => {
        // Did we receive a valid User?
        if (!res.locals.user) {
            throw new Forbidden(
                "No valid User identified",
                "OAuthMeRouter.put",
            );
        }
        const user: User = res.locals.user;
        // Construct a restricted update and return the result
        const update: Prisma.UserUpdateInput = req.body;
        delete update.active;
        delete update.scope;
        delete update.username;
        delete update.accessTokens;
        delete update.refreshTokens;
        // Perform the restricted update and return the result
        res.send(await UserActions.update(user.id, update));
    });


export default OAuthMeRouter;
