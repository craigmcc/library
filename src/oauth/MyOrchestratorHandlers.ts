// MyOrchestratorHandlers ----------------------------------------------------

// Handlers for use by @craigmcc/oauth-orchestrator.

// External Modules ----------------------------------------------------------

import {
    Identifier,
    AccessToken,
    RefreshToken,
    User,
    OrchestratorHandlers,
    AuthenticateUser,
    CreateAccessToken,
    CreateRefreshToken,
    RetrieveAccessToken,
    RetrieveRefreshToken,
    RevokeAccessToken,
} from "@craigmcc/oauth-orchestrator";

// Internal Modules ----------------------------------------------------------

import MyAccessToken from "../models/AccessToken";
import MyRefreshToken from "../models/RefreshToken";
import MyUser from "../models/User";
import { NotFound } from "../util/http-errors";
import { generateRandomToken, verifyPassword } from "../util/oauth-utils";

// Private Objects -----------------------------------------------------------

const authenticateUser: AuthenticateUser
    = async (username: string, password: string): Promise<User> =>
{

    // Look up the specified user
    const myUser: MyUser | null
        = await MyUser.findOne({
        where: { username: username }
    });
    if (!myUser) {
        throw new NotFound(
            "username: Missing or invalid username or password",
            "MyhOrchestratorHandlers.authenticateUser"
        );
    }
    if (!myUser.active) {
        // Creative subterfuge to not give anything away
        throw new NotFound(
            "username: Invalid or missing username or password",
            "MyhOrchestratorHandlers.authenticateUser"
        );
    }

    // Validate against the specified password
    if (!(await verifyPassword(password, myUser.password))) {
        // Creative subterfuge to not give anything away
        throw new NotFound(
            "username: Missing or invalid username or password",
            "MyhOrchestratorHandlers.authenticateUser"
        );
    }

    // Return the requested result
    return {
        scope: myUser.scope,
        // @ts-ignore
        userId: myUser.id
    }

}

const createAccessToken: CreateAccessToken
    = async (expires: Date, scope :string, userId: Identifier) =>
{

    // Prepare the MyAccessToken to be created
    let incomingId: number;
    if (typeof userId === "string") {
        incomingId = parseInt(userId);
    } else {
        incomingId = userId;
    }
    const incoming: Partial<MyAccessToken> = {
        expires: expires,
        scope: scope,
        token: await generateRandomToken(),
        userId: incomingId,
    }

    // Create the access token and return the relevant data
    const outgoing: MyAccessToken
        = await MyAccessToken.create(incoming, {
        fields: [ "expires", "scope", "token", "userId" ]
    });
    return {
        expires: outgoing.expires,
        scope: outgoing.scope,
        token: outgoing.token,
        userId: outgoing.id ? outgoing.id : 0 // Will never happen
    };

}

const createRefreshToken: CreateRefreshToken
    = async (accessToken: string, expires: Date, userId: Identifier) =>
{

    // Prepare the OAuthRefreshToken to be created
    let incomingId: number;
    if (typeof userId === "string") {
        incomingId = parseInt(userId);
    } else {
        incomingId = userId;
    }
    const incoming: Partial<MyRefreshToken> = {
        accessToken: accessToken,
        expires: expires,
        token: await generateRandomToken(),
        userId: incomingId,
    }

    // Create the refresh token and return the relevant data
    const outgoing: MyRefreshToken
        = await MyRefreshToken.create(incoming, {
        fields: [ "accessToken", "expires", "token", "userId" ]
    });
    return {
        accessToken: outgoing.accessToken,
        expires: outgoing.expires,
        token: outgoing.token,
        userId: outgoing.id ? outgoing.id : 0 // Will never happen
    };

}

const retrieveAccessToken: RetrieveAccessToken
    = async (token: string): Promise<AccessToken> =>
{

    // Look up the specified token
    const myAccessToken: MyAccessToken | null
        = await MyAccessToken.findOne({
        where: { token: token }
    });
    if (!myAccessToken) {
        throw new NotFound("token: Missing or invalid token");
    }

    // Return the requested result
    return {
        expires: myAccessToken.expires,
        scope: myAccessToken.scope,
        token: myAccessToken.token,
        userId: myAccessToken.userId,
    }

}

const retrieveRefreshToken: RetrieveRefreshToken
    = async (token: string): Promise<RefreshToken> =>
{

    // Look up the specified token
    const myRefreshToken: MyRefreshToken | null
        = await MyRefreshToken.findOne({
        where: { token: token }
    });
    if (!myRefreshToken) {
        throw new NotFound("token: Missing or invalid token");
    }

    // Return the requested result
    return {
        accessToken: myRefreshToken.accessToken,
        expires: myRefreshToken.expires,
        token: myRefreshToken.token,
        userId: myRefreshToken.userId,
    }

}

const revokeAccessToken: RevokeAccessToken = async (token: string): Promise<void> => {

    // Look up the specified token
    const myAccessToken: MyAccessToken | null
        = await MyAccessToken.findOne({
        where: { token: token }
    });
    if (!myAccessToken) {
        throw new NotFound(
            "token: Missing or invalid token",
            "MyhOrchestratorHandlers.revokeAccessToken"
        );
    }

    // Revoke any associated refresh tokens
    await MyRefreshToken.destroy({
        where: { accessToken: token }
    });

    // Revoke the access token as well
    await MyAccessToken.destroy({
        where: { token: token }
    });

}

// Public Objects ------------------------------------------------------------

const MyOrchestratorHandlers: OrchestratorHandlers = {
    authenticateUser: authenticateUser,
    createAccessToken: createAccessToken,
    createRefreshToken: createRefreshToken,
    retrieveAccessToken: retrieveAccessToken,
    retrieveRefreshToken: retrieveRefreshToken,
    revokeAccessToken: revokeAccessToken,
}

export default MyOrchestratorHandlers;
