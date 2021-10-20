// OAuthOrchestratorHandlers -------------------------------------------------

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
} from "@craigmcc/oauth-orchestrator";

// Internal Modules ----------------------------------------------------------

import {generateRandomToken, verifyPassword} from "./OAuthUtils";
//import AccessToken from "../models/AccessToken";
//import RefreshToken from "../models/RefreshToken";
import User from "../models/User";

// Private Objects -----------------------------------------------------------

const authenticateUser: AuthenticateUser
    = async (username: string, password: string) =>
{

    // Look up the specified user
    const user = await User.findOne({
        where: { username: username }
    });

    if (user) {

        // Validate active status
        // @ts-ignore
        if (!user.active) {
            // Creative subterfuge to not give anything away
            throw new InvalidRequestError(
                "username: Invalid or missing username or password",
                "OAuthOrchestratorHandlers.authenticateUser"
            );
        }

        // Validate against the specified password
        // @ts-ignore
        if (!(await verifyPassword(password, user.password))) {
            // Creative subterfuge to not give anything away
            throw new InvalidRequestError(
                "username: Missing or invalid username or password",
                "OAuthOrchestratorHandlers.authenticateUser"
            );
        }

        // Return the validated result
        return {
            // @ts-ignore
            scope: user.scope,
            // @ts-ignore
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

    throw new InvalidRequestError(
        "createAccessToken is not yet implemented",
        "OAuthOrchestratorHandlers.createAccessToken"
    );

    // Prepare the AccessToken to be created
/*
    let incomingId : number;
    if (typeof userId === "string") {
        incomingId = parseInt(userId);
    } else {
        incomingId = userId;
    }
    const incoming: Partial<AccessToken> = {
        expires: expires,
        scope: scope,
        token: await generateRandomToken(),
        userId: incomingId,
    }
*/

    // Create the access token and return the relevant data
/*
    const outgoing = await AccessToken.create(incoming, {
        fields: [ "expires", "scope", "token", "userId" ]
    });
    return {
        expires: outgoing.expires,
        scope: outgoing.scope,
        token: outgoing.token,
        userId: outgoing.id,
    };
*/

}

const createRefreshToken: CreateRefreshToken
    = async (accessToken: string, expires: Date, userId: Identifier) =>
{

    throw new InvalidRequestError(
        "createRefreshToken is not yet implemented",
        "OAuthOrchestratorHandlers.createRefreshToken"
    );

    // Prepare the OAuthRefreshToken to be created
/*
    let incomingId: number;
    if (typeof userId === "string") {
        incomingId = parseInt(userId);
    } else {
        incomingId = userId;
    }
    const incoming: Partial<RefreshToken> = {
        accessToken: accessToken,
        expires: expires,
        token: await generateRandomToken(),
        userId: incomingId,
    }
*/

    // Create the refresh token and return the relevant data
/*
    const outgoing = await RefreshToken.create(incoming, {
        fields: [ "accessToken", "expires", "token", "userId" ]
    });
    return {
        accessToken: outgoing.accessToken,
        expires: outgoing.expires,
        token: outgoing.token,
        userId: outgoing.id,
    };
*/

}

const retrieveAccessToken: RetrieveAccessToken = async (token: string) => {

    throw new InvalidRequestError(
        "retrieveAccessToken is not yet implemented",
        "OAuthOrchestratorHandlers.retrieveAccessToken"
    );

    // Look up the specified token
/*
    const accessToken = await AccessToken.findOne({
        where: { token: token }
    });
    if (!accessToken) {
        throw new InvalidRequestError(
            "token: Missing or invalid token",
            "OAuthOrchestratorHandlers.retrieveAccessToken"
        );
    }
*/

    // Return the requested result
/*
    return {
        expires: accessToken.expires,
        scope: accessToken.scope,
        token: accessToken.token,
        userId: accessToken.userId,
    }
*/

}

const retrieveRefreshToken: RetrieveRefreshToken = async (token: string) => {

    throw new InvalidRequestError(
        "retrieveRefreshToken is not yet implemented",
        "OAuthOrchestratorHandlers.retrieveRefreshToken"
    );

    // Look up the specified token
/*
    const refreshToken = await RefreshToken.findOne({
        where: { token: token }
    });
    if (!refreshToken) {
        throw new InvalidRequestError(
            "token: Missing or invalid token",
            "OAuthOrchestratorHandlers.retrieveRefreshToken"
        );
    }
*/

    // Return the requested result
/*
    return {
        accessToken: refreshToken.accessToken,
        expires: refreshToken.expires,
        token: refreshToken.token,
        userId: refreshToken.userId,
    }
*/

}

const revokeAccessToken: RevokeAccessToken = async (token: string): Promise<void> => {

    throw new InvalidRequestError(
        "revokeAccessToken is not yet implemented",
        "OAuthOrchestratorHandlers.revokeAccessToken"
    );

    // Look up the specified token
/*
    const accessToken = await AccessToken.findOne({
        where: { token: token }
    });
    if (!accessToken) {
        throw new InvalidRequestError(
            "token: Missing or invalid token",
            "OAuthOrchestratorHandlers.revokeAccessToken"
        );
    }
*/

    // Revoke any associated refresh tokens
/*
    await RefreshToken.destroy({
        where: { accessToken: token }
    });
*/

    // Revoke the access token as well
/*
    await AccessToken.destroy({
        where: { token: token }
    });
*/

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

