// LoginDataUtils ------------------------------------------------------------

// Common utility functions for handling OAuth interactions, plus managing
// local storage for Login Data.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import logger from "./ClientLogger";
import LocalStorage from "./LocalStorage";
import {LOGIN_DATA_KEY, LOGIN_USER_KEY} from "../constants";
import {LoginData} from "../types";
import Credentials from "../models/Credentials";
import OAuth from "../clients/OAuth";
import User from "../models/User";
import * as ToModel from "./ToModel";
import * as Abridgers from "./Abridgers";

// Models --------------------------------------------------------------------

/**
 * Authentication request parameters for an OAuth authentication server
 * with credentials to be authenticated.
 */
export interface PasswordTokenRequest {
    grant_type: string;                 // Request type "password"
    password: string;                   // Request password
    username: string;                   // Request username
}

/**
 * Authentication request parameters for an OAuth authentication server
 * with a refresh token to exchange for new access token.
 */
export interface RefreshTokenRequest {
    grant_type: string;                 // Request type "refresh_token"
    refresh_token: string;              // Refresh token to exchange
}

/**
 * Authentication successful response from an OAuth authentication server.
 */
export interface TokenResponse {
    access_token: string;               // Assigned access token
    expires_in: number;                 // Number of seconds before the access token expires
    refresh_token?: string;             // Assigned refresh token (if any)
    scope: string;                      // Authorized scope(s) - space separated
    token_type: string;                 // Token type supported by this server
}

// Private Objects ----------------------------------------------------------

const loginData = new LocalStorage<LoginData>(LOGIN_DATA_KEY);
const loginUser = new LocalStorage<User>(LOGIN_USER_KEY);

// Public Objects -----------------------------------------------------------

/**
 * Handle login for the specified credentials.
 *
 * @param credentials                   Username and password to be submitted
 *
 * @returns                             Updated LoginData after login
 *
 * @throws Error                        If login was not successful
 */
export const login = async (credentials: Credentials): Promise<LoginData> => {

    // Use the specified Credentials to acquire tokens
    const tokenRequest: PasswordTokenRequest = {
        grant_type: "password",
        password: credentials.password,
        username: credentials.username,
    }
    // Will throw Error on login failure
    const tokenResponse: TokenResponse =
        (await OAuth.post("/token", tokenRequest)).data;
    logger.debug({
        context: "LoginDataUtils.login",
        msg: "Successful login",
        username: credentials.username,
    });

    // Construct, save, and return LoginData representing the new state
    const newData: LoginData = {
        accessToken: tokenResponse.access_token,
        alloweds: tokenResponse.scope ? tokenResponse.scope.split(" ") : [],
        expires: new Date((new Date()).getTime() + (tokenResponse.expires_in * 1000)),
        loggedIn: true,
        refreshToken: tokenResponse.refresh_token ? tokenResponse.refresh_token : null,
        scope: tokenResponse.scope,
        username: credentials.username,
    }
    loginData.value = newData;
    return newData;

}

/**
 * Handle logout for the currently logged-in User.
 *
 * @returns                             Updated LoginData after logout
 */
export const logout = async (): Promise<LoginData> => {

    let currentData = loginData.value;

    // Revoke the currently assigned access token (if any)
    if (currentData.loggedIn && currentData.accessToken) {
        try {
            await OAuth.delete("/token", {
                headers: {
                    "Authorization": `Bearer ${currentData.accessToken}`
                }
            });
        } catch (error) {
            logger.error({
                context: "loginDataUtils.logout",
                msg: "Logout failed",
                username: currentData.username,
                error: (error as Error).message,
            });
            // Ignore any error
        }
    }

    // Update, store, and return login data after the logout
    currentData = {
        accessToken: null,
        alloweds: [],
        expires: null,
        loggedIn: false,
        refreshToken: null,
        scope: null,
        username: null,
    }
    loginData.value = currentData;
    return currentData;

}

/**
 * If the current access token is expired, and if there is a refresh token,
 * use the refresh token to request a new access token.  Return an updated
 * LoginData object if this was accomplished, or the current one if not.
 *
 * @returns                             Possibly updated LoginData after refresh
 *
 * @throws OAuthError                   If an authentication error occurs
 */
export const refresh = async (): Promise<LoginData> => {

    let currentData = loginData.value;
    const now = new Date();

    // If the current access token looks unexpired, or there is no
    // refresh token, return the current data unchanged
    if (!currentData.accessToken) {
        return currentData;
    }
    if (currentData.expires) {
        // Coming back from local storage expires is a string
        const expiresDate = (typeof currentData.expires === "string")
            ? new Date(currentData.expires)
            : currentData.expires;
        if (expiresDate > now) {
            return currentData;
        }
    }
    if (!currentData.refreshToken) {
        return currentData;
    }

    try {

        // Attempt to use the refresh token to acquire a new access token,
        // update the current local data.
        const tokenRequest: RefreshTokenRequest = {
            grant_type: "refresh_token",
            refresh_token: currentData.refreshToken,
        }
        const tokenResponse: TokenResponse =
            (await OAuth.post("/token", tokenRequest)).data;
        currentData.accessToken = tokenResponse.access_token;
        currentData.alloweds = tokenResponse.scope ? tokenResponse.scope.split(" ") : [];
        currentData.expires = new Date((new Date()).getTime() + (tokenResponse.expires_in * 1000));
        currentData.loggedIn = true;
        if (tokenResponse.refresh_token) {
            currentData.refreshToken = tokenResponse.refresh_token ? tokenResponse.refresh_token : null;
        } else {
            // Keep the previous refresh token
        }
        currentData.scope = tokenResponse.scope;
        // NOTE - Leave loggedIn and username alone

        // Store and return the updated login data
        logger.debug({
            context: "LoginDataUtils.refresh",
            msg: "Updating login data for refreshed access token",
            data: currentData,
        });
        loginData.value = currentData;
        return currentData;

    } catch (error) {

        // Report an error and return the current login data unchanged
        logger.info({
            context: "LoginDataUtils.refresh",
            msg: "Attempted refresh returned an error",
            message: (error as Error).message,
        });
        return currentData;

    }

}

/**
 * Refresh the User object (will be null if a user is not logged on).
 *
 * @param theData                   Optional LoginData (needed during handleLogin
 *                                  but can be omitted if calling this independently)
 *
 * @returns                         Currently logged-in user, or a placeholder
 */
export const refreshUser = async (theData?: LoginData): Promise<User> => {
    const useData: LoginData = theData ? theData : loginData.value;
    logger.debug({
        context: "LoginDataUtils.refreshUser",
        data: useData,
    });
    if (useData.loggedIn) {
        const user: User = ToModel.USER((await OAuth.get("/me")).data);
        logger.info({
            context: "LoginDataUtils.refreshUser",
            user: Abridgers.USER(user),
        });
        return user;
    } else {
        logger.info({
            context: "LoginDataUtils.refreshUser",
            msg: "Not logged in",
        });
        return new User({
            active: false,
            firstName: "-----",
            lastName: "-----",
        });
    }
}
