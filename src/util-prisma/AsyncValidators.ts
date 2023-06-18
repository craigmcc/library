// util-prisma/AsyncValidators.ts

/**
 * Custom (to this application) validation methods that can only be used by
 * server actions, because they interact directly with the database.
 * A "true" return indicates that the specified value is valid, while a
 * "false" return indicates that it is not.  If a field is required, that
 * must be validated separately.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Library,
    Prisma,
    Story,
    User,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import prisma from "../prisma";
import { ServerError } from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

/**
 * Validate that the name of this Library is globally unique.
 *
 * @param library                       Library whose name is to be validated
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const validateLibraryNameUnique = async (library: Library): Promise<boolean> => {
    if (library && library.name) {
        const args: Prisma.LibraryFindManyArgs = {};
        if (library.id && (library.id > 0)) {
            args.where = {
                id: {
                    not: library.id,
                },
                name: library.name,
            }
        } else {
            args.where = {
                name: library.name,
            }
        }
        try {
            const results = await prisma.library.findMany(args);
            return (results.length === 0);
        } catch (error) {
            throw new ServerError(
                error as Error,
                "validateLibraryNameUnique",
            )
        }
    } else {
        return true;
    }
}

/**
 * Validate that the name of this Story is unique within its Library.
 *
 * @param story                         Story whose name is to be validated
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const validateStoryNameUnique = async (story: Story): Promise<boolean> => {
    if (story && story.name) {
        const args: Prisma.StoryFindManyArgs = {};
        if (story.id && (story.id > 0)) {
            args.where = {
                id: {
                    not: story.id,
                },
                libraryId: story.libraryId,
                name: story.name,
            }
        } else {
            args.where = {
                libraryId: story.libraryId,
                name: story.name,
            }
        }
        try {
            const results = await prisma.story.findMany(args);
            return (results.length === 0);
        } catch (error) {
            throw new ServerError(
                error as Error,
                "validateStoryNameUnique",
            )
        }
    } else {
        return true;
    }
}

/**
 * Validate that the scope of this Library is globally unique.
 *
 * @param library                       Library whose scope is to be validated
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const validateLibraryScopeUnique = async (library: Library): Promise<boolean> => {
    if (library && library.scope) {
        const args: Prisma.LibraryFindManyArgs = {};
        if (library.id && (library.id > 0)) {
            args.where = {
                id: {
                    not: library.id,
                },
                scope: library.scope,
            }
        } else {
            args.where = {
                scope: library.scope,
            }
        }
        try {
            const results = await prisma.library.findMany(args);
            return (results.length === 0);
        } catch (error) {
            throw new ServerError(
                error as Error,
                "validateLibraryScopeUnique",
            )
        }
    } else {
        return true;
    }
}

/**
 * Validate that the username of this User is globally unique.
 *
 * @param user                          User whose username is to be validated
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const validateUserUsernameUnique = async (user: User): Promise<boolean> => {
    if (user && user.username) {
        const args: Prisma.UserFindManyArgs = {};
        if (user.id && (user.id > 0)) {
            args.where = {
                id: {
                    not: user.id,
                },
                username: user.username,
            }
        } else {
            args.where = {
                username: user.username,
            }
        }
        try {
            const results = await prisma.user.findMany(args);
            return (results.length === 0);
        } catch (error) {
            throw new ServerError(
                error as Error,
                "validateUserUsernameUnique",
            )
        }
    } else {
        return true;
    }
}

