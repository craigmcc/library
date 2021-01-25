// TokenRouter ---------------------------------------------------------------

// Router for  acquiring and revoking tokens.

// External Modules ----------------------------------------------------------

import {
    PasswordTokenRequest,
    RefreshTokenRequest,
    TokenRequest,
    TokenResponse
} from "@craigmcc/oauth-orchestrator";
import { Request, Response, Router } from "express";

const PASSWORD_GRANT_TYPE = "password";
const REFRESH_GRANT_TYPE = "refresh_token";

// Internal Modules ----------------------------------------------------------

//import { requireAny } from "./MyMiddleware";
import { OAuthOrchestrator } from "../server";
import { BadRequest, ServerError } from "../util/http-errors";
import logger from "../util/server-logger";

// Public Objects ------------------------------------------------------------

const TokenRouter = Router({
    strict: true
});

// Revoke the access token (and any related refresh token)
// that was used to authorize this request.
TokenRouter.delete("/",
//    requireAny, // TODO - need middleware
    async (req: Request, res: Response) => {
        logger.info({
            context: "MyTokenRouter.revoke",
            token: res.locals.token
        });
        // Successful authorization stored our token in res.locals.token
        const token: string = res.locals.token;
        if (token) {
            await OAuthOrchestrator.revoke(token);
            // Any thrown error will get handled by middleware
            res.status(204).send();
        } else {
            throw new ServerError(
                "Token to revoke should have been present",
                "MyTokenRouter.revoke");
        }
    });

// Return the user object for the (validated) access token
// that was used to authorize this request.
/* TODO - need UserServices
MyTokenRouter.get("/",
//    requireAny, // TODO - need middleware
    async (req: Request, res: Response) => {
        logger.info({
            context: "MyTokenRouter.me",
            token: res.locals.token
        });
        res.send(await UserServices.me(res.locals.token));
    })
*/

// Request access token and optional refresh token.
TokenRouter.post("/",
    async (req: Request, res: Response) => {
        let tokenRequest : TokenRequest;
        switch (req.body.grant_type) {
            case PASSWORD_GRANT_TYPE:
                const passwordTokenRequest: PasswordTokenRequest = {
                    grant_type: req.body.grant_type,
                    scope: req.body.scope ? req.body.scope : undefined,
                    password: req.body.password,
                    username: req.body.username,
                }
                tokenRequest = passwordTokenRequest;
                break;
            case REFRESH_GRANT_TYPE:
                const refreshTokenRequest: RefreshTokenRequest = {
                    grant_type: req.body.grant_type,
                    scope: req.body.scope ? req.body.scope : undefined,
                    refresh_token: req.body.refresh_token,
                }
                tokenRequest = refreshTokenRequest;
                break;
            default:
                throw new BadRequest(
                    "Unsupported token grant type",
                    "MyTokenRouter.token"
                );
        }
        const input: any = {
            ...tokenRequest
        };
        if (input.password) {
            input.password = "*REDACTED*";
        }
        try {
            const tokenResponse: TokenResponse
                = await OAuthOrchestrator.token(tokenRequest);
            const output: any = {
                ...tokenResponse
            }
            logger.info({
                context: "MyTokenRouter.token",
                input: input,
                output: output
            });
            res.send(tokenResponse);
        } catch (error) {
            logger.info({
                context: "MyTokenRouter.token",
                input: input,
                error: error,
            });
            // Handle errors with standard middleware
            throw error;
        }

    });

export default TokenRouter;
