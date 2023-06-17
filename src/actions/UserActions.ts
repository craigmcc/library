"use server"

// actions/UserActions.ts

/**
 * Server side actions for User model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Prisma,
    User,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import prisma from "../prisma";
import {BadRequest, NotFound, NotUnique, ServerError} from "../util/HttpErrors";
import { validateUserUsernameUnique} from "../util-prisma/AsyncValidators";
import * as ToModel from "../util-prisma/ToModel";
import {hashPassword} from "../oauth/OAuthUtils";

// Public Types --------------------------------------------------------------

export type UserPlus = User & Prisma.UserGetPayload<{
    include: {
        accessTokens: true,
        refreshTokens: true,
    }
}>

// Action CRUD Functions -----------------------------------------------------

/**
 * Return all User instances that match the specified criteria.
 *
 * @param query                         Optional match query parameters
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const all = async (query?: any): Promise<UserPlus[]> => {
    const args: Prisma.UserFindManyArgs = {
        // cursor???
        // distinct???
        include: include(query),
        orderBy: orderBy(query),
        select: select(query),
        skip: skip(query),
        take: take(query),
        where: where(query),
    }
    try {
        const results = await prisma.user.findMany(args);
        for (const result of results) {
            result.password = "";
        }
        return results as UserPlus[];
    } catch (error) {
        throw new ServerError(
            error as Error,
            "UserActions.all",
        )
    }
}

/**
 * Return the User instance with the specified userId, or throw NotFound.
 *
 * @param userId                        ID of the requested User
 * @param query                         Optional include query parameters
 *
 * @throws NotFound                     If no such User is found
 * @throws ServerError                  If a low level error is thrown
 */
export const find = async (userId: number, query?: any): Promise<UserPlus> => {
    const args: Prisma.UserFindUniqueArgs = {
        include: include(query),
        where: {
            id: userId,
        }
    }
    try {
        const result = await prisma.user.findUnique(args);
        if (result) {
            result.password = "";
            return result as UserPlus;
        } else {
            throw new NotFound(
                `id: Missing User ${userId}`,
                "UserActions.find"
            )
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "UserActions.find",
            )
        }
    }
}

/**
 * Create and return a new User instance, if it satisfies validation.
 *
 * @param user                       User to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (user: Prisma.UserCreateInput): Promise<UserPlus> => {
    const model: User = ToModel.USER(user);
    if (!await validateUserUsernameUnique(model)) {
        throw new NotUnique(
            `username: User username '${user.username}' is already in use`,
            "UserActions.insert",
        )
    }
    const args: Prisma.UserCreateArgs = {
        data: {
            ...user,
            password: await hashPassword(user.password),
        },
    }
    try {
        const result = await prisma.user.create(args);
        result.password = "";
        return result as UserPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "UserActions.insert"
        );
    }
}

/**
 * Remove and return the specified User.
 *
 * @param userId                        ID of the User to be removed
 *
 * @throws NotFound                     If no such User is found
 * @throws ServerError                  If a low level error is thrown
 */
export const remove = async (userId: number): Promise<UserPlus> => {
    await find(userId); // May throw NotFound
    try {
        const result = await prisma.user.delete({
            where: {
                id: userId,
            }
        });
        result.password = "";
        return result as UserPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "UserActions.remove",
        );
    }
}

/**
 * Update and return the specified User.
 *
 * @param userId                        ID of the User to be updated
 * @param user                          Updated data
 *
 * @throws BadRequest                   If validation fails
 * @throws NotFound                     If no such User is found
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error is thrown
 */
export const update = async (userId: number, user: Prisma.UserUpdateInput): Promise<UserPlus> => {
    const original = await find(userId); // May throw NotFound
    const model: User = {
        ...ToModel.USER(user),
        id: userId,
    }
    if (user.username && (!await validateUserUsernameUnique(model))) {
        throw new NotUnique(
            `username: User username '${user.username}' is already in use`,
            "UserActions.update",
        )
    }
    try {
        const result = await prisma.user.update({
            data: {
                ...user,
                id: userId,      // No cheating
                password: user.password && (typeof user.password === "string") && (user.password.length > 0) ? await hashPassword(user.password) : undefined,
            },
            where: {
                id: userId,
            }
        });
        result.password = "";
        return result as UserPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "UserActions.update"
        );
    }
}

// Action Unique Functions ---------------------------------------------------

// TODO - accessTokens()

/**
 * Return the User instance with the specified username, or throw NotFound.
 *
 * @param username                      Username of the requested User
 * @param query                         Optional include query parameters
 *
 * @throws NotFound                     If no such User is found
 * @throws ServerError                  If a low level error is thrown
 */
export const exact = async (username: string, query?: any): Promise<UserPlus> => {
    const args: Prisma.UserFindUniqueArgs = {
        include: include(query),
        where: {
            username: username,
        }
    }
    try {
        const result = await prisma.user.findUnique(args);
        if (result) {
            result.password = "";
            return result as UserPlus;
        } else {
            throw new NotFound(
                `username: Missing User '${username}'`,
                "UserActions.exact",
            )
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "UserActions.exact",
            )
        }
    }
}

// TODO - refreshTokens()

// Support Functions ---------------------------------------------------------

/**
 * Calculate and return the "include" options from the specified query
 * parameters, if any were specified.
 */
export const include = (query?: any): Prisma.UserInclude | undefined => {
    if (!query) {
        return undefined;
    }
    const include: Prisma.UserInclude = {};
    if (query.hasOwnProperty("withAccessTokens")) {
        include.accessTokens = true;
    }
    if (query.hasOwnProperty("withRefreshTokens")) {
        include.refreshTokens = true;
    }
    if (Object.keys(include).length > 0) {
        return include;
    } else {
        return undefined;
    }
}

/**
 * Calculate and return the "orderBy" options from the specified query
 * parameters, if any were specified.
 */
export const orderBy = (query?: any): Prisma.UserOrderByWithRelationInput => {
    return {
        username: "asc",
    }
}

/**
 * Calculate and return the "select" options from the specified query
 * parameters, if any were specified.
 */
export const select = (query?: any): Prisma.UserSelect | undefined => {
    return undefined; // TODO - for future use
}

/**
 * Calculate and return the "skip" options from the specified query
 * parameters, if any were specified.
 *
 * For backwards compatibility, either "offset" or "skip" are recognized.
 */
export const skip = (query?: any): number | undefined => {
    if (!query) {
        return undefined;
    }
    if (query.hasOwnProperty("offset")) {
        return Number(query.offset);
    } else if (query.hasOwnProperty("skip")) {
        return Number(query.skip);
    } else {
        return undefined;
    }
}

/**
 * Calculate and return the "take" options from the specified query
 * parameters, if any were specified.
 *
 * For backwards compatibility, either "limit" or "take" are recognized.
 */
export const take = (query?: any): number | undefined => {
    if (!query) {
        return undefined;
    }
    if (query.hasOwnProperty("limit")) {
        return Number(query.limit);
    } else if (query.hasOwnProperty("take")) {
        return Number(query.take);
    } else {
        return undefined;
    }
}

/**
 * Calculate and return the "where" options from the specified query
 * parameters, if any were specified.
 */
export const where = (query?: any): Prisma.UserWhereInput | undefined => {
    if (!query) {
        return undefined;
    }
    const where: Prisma.UserWhereInput = {};
    if (query.hasOwnProperty("active")) {
        where.active = true;
    }
    if (query.hasOwnProperty("username")) {
        where.username = {              // TODO - verify that this does an "ilike"
            contains: query.username,
            mode: "insensitive",
        }
    }
    if (Object.keys(where).length > 0) {
        return where;
    } else {
        return undefined;
    }
}
