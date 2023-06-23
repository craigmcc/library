// oauth-prisma/OAuthOrchestratorHandlers

// Handlers for use by @craigmcc/oauth-orchestrator.

// External Modules ----------------------------------------------------------

import {
    Identifier,
    AuthenticateUser,
    CreateAccessToken,
    CreateRefreshToken,
    InvalidRequestError,
    OrchestratorHandlers,
    RetrieveAccessToken,
    RetrieveRefreshToken,
    RevokeAccessToken,
    ServerError,
} from "@craigmcc/oauth-orchestrator";
import {
    Prisma,
} from "@prisma/client"

// Internal Modules ----------------------------------------------------------

import prisma from "../prisma";
import * as AccessTokenActions from "../actions/AccessTokenActions";
import * as RefreshTokenActions from "../actions/RefreshTokenActions";
import * as UserActions from "../actions/UserActions";
import {generateRandomToken, verifyPassword} from "../oauth/OAuthUtils";
import {NotFound} from "../util/HttpErrors";

// Private Objects -----------------------------------------------------------

const authenticateUser: AuthenticateUser
    = async (username: string, password: string) =>
{
    const user = await UserActions.exact(username);
    if (user) {
        if (!user.active) {
            // Creative subterfuge to not give anything away
            throw new InvalidRequestError(
                "username: Invalid or missing username or password",
                "OAuthOrchestratorHandlers.authenticateUser"
            );
        }
        if (!(await verifyPassword(password, user.password))) {
            // Creative subterfuge to not give anything away
            throw new InvalidRequestError(
                "username: Missing or invalid username or password",
                "OAuthOrchestratorHandlers.authenticateUser"
            );
        }
        return {
            scope: user.scope,
            userId: user.id
        }
    } else {
        throw new InvalidRequestError(
            "username: Missing or invalid username or password",
            "OAuthOrchestratorHandlers.authenticateUser"
        );
    }
}

const createAccessToken: CreateAccessToken
    = async (expires: Date, scope :string, userId: Identifier) =>
{
    const input: Prisma.AccessTokenUncheckedCreateInput = {
        expires: expires,
        scope: scope,
        token: await generateRandomToken(),
        userId: Number(userId).valueOf(),
    }
    const outgoing =
        await AccessTokenActions.insert(input);
    return {
        expires: outgoing.expires,
        scope: outgoing.scope,
        token: outgoing.token,
        userId: outgoing.id,
    };
}

const createRefreshToken: CreateRefreshToken
    = async (accessToken: string, expires: Date, userId: Identifier) =>
{
    const input: Prisma.RefreshTokenUncheckedCreateInput = {
        accessToken: accessToken,
        expires: expires,
        token: await generateRandomToken(),
        userId: Number(userId).valueOf(),
    }
    const outgoing =
        await RefreshTokenActions.insert(input);
    return {
        accessToken: outgoing.accessToken,
        expires: outgoing.expires,
        token: outgoing.token,
        userId: outgoing.id,
    };
}

const retrieveAccessToken: RetrieveAccessToken = async (token: string) => {
    const accessToken = await AccessTokenActions.exact(token);
    if (accessToken) {
        return {
            expires: accessToken.expires,
            scope: accessToken.scope,
            token: accessToken.token,
            userId: accessToken.userId,
        }
    } else {
        throw new InvalidRequestError(
            "token: Missing or invalid token",
            "OAuthOrchestratorHandlers.retrieveAccessToken"
        );
    }
}

const retrieveRefreshToken: RetrieveRefreshToken = async (token: string) => {
    const refreshToken = await RefreshTokenActions.exact(token);
    if (refreshToken) {
        return {
            accessToken: refreshToken.accessToken,
            expires: refreshToken.expires,
            token: refreshToken.token,
            userId: refreshToken.userId,
        }
    } else {
        throw new InvalidRequestError(
            "token: Missing or invalid token",
            "OAuthOrchestratorHandlers.retrieveRefreshToken"
        );
    }
}

const revokeAccessToken: RevokeAccessToken = async (token: string): Promise<void> => {
    try {
        await AccessTokenActions.revoke(token);
    } catch (error) {
        if (error instanceof NotFound) {
            throw new InvalidRequestError(
                "token: Missing or invalid token",
                "OAuthOrchestratorHandlers.revokeAccessToken"
            );
        } else {
            throw new ServerError(
                error as Error,
                "OAuthOrchestratorHandlers.revokeAccessToken",
            )
        }
    }
    // Revoke the access token
    const results = await prisma.accessToken.deleteMany({
        where: {
            token: token,
        }
    });
    if (results.count < 1) {
        throw new InvalidRequestError(
            "token: Missing or invalid token",
            "OAuthOrchestratorHandlers.revokeAccessToken"
        );
    }
    // Revoke any related RefreshToken
    await prisma.refreshToken.deleteMany({
        where: {
            accessToken: token,
        }
    });
}

// Public Objects ------------------------------------------------------------

export const OAuthOrchestratorHandlers: OrchestratorHandlers = {
    authenticateUser: authenticateUser,
    createAccessToken: createAccessToken,
    createRefreshToken: createRefreshToken,
    retrieveAccessToken: retrieveAccessToken,
    retrieveRefreshToken: retrieveRefreshToken,
    revokeAccessToken: revokeAccessToken,
}

export default OAuthOrchestratorHandlers;

