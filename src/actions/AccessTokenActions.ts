"use server"

// actions/AccessTokenActions.ts

/**
 * Server side actions for AccessToken model objects, only including functions
 * that are required for OAuth support.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Prisma,
    AccessToken,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import prisma from "../prisma";
import {BadRequest, NotFound, ServerError} from "../util/HttpErrors";

// Public Types --------------------------------------------------------------

export type AccessTokenPlus = AccessToken & Prisma.AccessTokenGetPayload<{
    include: {
        user: true,
    }
}>;

// Public Functions ----------------------------------------------------------

/**
 * Find and return the AccessToken that matches the specified token value.
 *
 * @param token                         Token value to be retrieved
 * @param query                         Optional query parameters
 *
 */
export const exact = async (token: string, query?: any): Promise<AccessTokenPlus | null> => {
    try {
        const result = await prisma.accessToken.findUnique({
            include: include(query),
            where: {
                token: token,
            }
        });
        if (result) {
            return result as AccessTokenPlus;
        } else {
            return null;
        }
    } catch (error) {
        throw new ServerError(
            error as Error,
            "AccessTokenActions.exact"
        );
    }
}

/**
 * Create and return an AccessToken instance.
 *
 * @param accessToken                   AccessToken to be created
 * @param query
 *
 * @throws ServerError                  If a low level error occurs
 */
export const insert = async (accessToken: Prisma.AccessTokenUncheckedCreateInput): Promise<AccessTokenPlus> => {
    try {
        const args: Prisma.AccessTokenCreateArgs = {
            data: {
                ...accessToken
            }
        }
        const result = await prisma.accessToken.create(args);
        return result as AccessTokenPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "AccessTokenActions.insert"
        );
    }
}

/**
 * Revoke the specified AccessToken and any related RefreshTokens.
 *
 * @param token                         Access token value to be revoked
 * @returns                             Count of revoked access tokens
 *
 * @throws NotFound                     If no such access token is found
 * @throws ServerError                  If a low level error occurs
 */
export const revoke = async (token: string): Promise<number> => {
    try {
        // Delete this access token
        const results = await prisma.accessToken.deleteMany({
            where: {
                token: token,
            }
        });
        // Delete any corresponding refresh tokens
        await prisma.refreshToken.deleteMany({
            where: {
                accessToken: token,
            }
        });
        // Return the count of revoked access tokens
        return results.count;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "AccessTokenActions.revoke",
        );
    }

}

// Support Functions ---------------------------------------------------------

/**
 * Calculate and return the "include" options from the specified query
 * parameters, if any were specified.
 */
export const include = (query?: any): Prisma.AccessTokenInclude | undefined => {
    if (!query) {
        return undefined;
    }
    const include: Prisma.AccessTokenInclude = {};
    if (query.hasOwnProperty("withUser")) {
        include.user = true;
    }
    if (Object.keys(include).length > 0) {
        return include;
    } else {
        return undefined;
    }
}

