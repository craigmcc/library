"use server"

// actions/RefreshTokenActions.ts

/**
 * Server side actions for RefreshToken model objects, only including functions
 * that are required for OAuth support.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Prisma,
    RefreshToken,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import prisma from "../prisma";
import {BadRequest, ServerError} from "../util/HttpErrors";

// Public Types --------------------------------------------------------------

export type RefreshTokenPlus = RefreshToken & Prisma.RefreshTokenGetPayload<{
    include: {
        user: true,
    }
}>;

// Public Functions ----------------------------------------------------------

/**
 * Find and return the RefreshToken that matches the specified token value.
 *
 * @param token                         Token value to be retrieved
 * @param query                         Optional query parameters
 *
 */
export const exact = async (token: string, query?: any): Promise<RefreshTokenPlus | null> => {
    try {
        const result = await prisma.refreshToken.findUnique({
            include: include(query),
            where: {
                token: token,
            }
        });
        if (result) {
            return result as RefreshTokenPlus;
        } else {
            return null;
        }
    } catch (error) {
        throw new ServerError(
            error as Error,
            "RefreshTokenActions.exact"
        );
    }
    // TODO - "token" should be a unique constraint
    const refreshTokens = await prisma.refreshToken.findMany({
        include: include(query),
        where: {token: token}
    });
    if (refreshTokens.length > 0) {
        return refreshTokens[0] as RefreshTokenPlus;
    } else {
        return null;
    }
}

/**
 * Create and return a RefreshToken instance.
 *
 * @param refreshToken                  RefreshToken to be created
 *
 * @throws ServerError                  If a low level error occurs
 */
export const insert = async (refreshToken: Prisma.RefreshTokenUncheckedCreateInput): Promise<RefreshTokenPlus> => {
    try {
        const args: Prisma.RefreshTokenCreateArgs = {
            data: {
                ...refreshToken
            }
        }
        const result = await prisma.refreshToken.create(args);
        return result as RefreshTokenPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "RefreshTokenActions.insert"
        );
    }
}

// Support Functions ---------------------------------------------------------

/**
 * Calculate and return the "include" options from the specified query
 * parameters, if any were specified.
 */
export const include = (query?: any): Prisma.RefreshTokenInclude | undefined => {
    if (!query) {
        return undefined;
    }
    const include: Prisma.RefreshTokenInclude = {};
    if (query.hasOwnProperty("withUser")) {
        include.user = true;
    }
    if (Object.keys(include).length > 0) {
        return include;
    } else {
        return undefined;
    }
}

