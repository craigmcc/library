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
    Author,
    Library,
    Prisma,
    Series,
    Story,
    User,
    Volume,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import prisma from "../prisma";
import { ServerError } from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

/**
 * Validate that the full name of this Author is unique within its Library.
 *
 * @param author                        Author whose name is to be validated
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const validateAuthorNameUnique = async (author: Author): Promise<boolean> => {
    if (author && author.firstName && author.lastName) {
        const args: Prisma.AuthorFindManyArgs = {};
        if (author.id && (author.id > 0)) {
            args.where = {
                id: {
                    not: author.id,
                },
                firstName: author.firstName,
                lastName: author.lastName,
                libraryId: author.libraryId,
            }
        } else {
            args.where = {
                firstName: author.firstName,
                lastName: author.lastName,
                libraryId: author.libraryId,
            }
        }
        try {
            const results = await prisma.author.findMany(args);
            return (results.length === 0);
        } catch (error) {
            throw new ServerError(
                error as Error,
                "validateAuthorNameUnique",
            )
        }
    } else {
        return true;
    }
}

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
 * Validate that the name of this Series is unique within its Library.
 *
 * @param series                        Series whose name is to be validated
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const validateSeriesNameUnique = async (series: Series): Promise<boolean> => {
    if (series && series.name) {
        const args: Prisma.SeriesFindManyArgs = {};
        if (series.id && (series.id > 0)) {
            args.where = {
                id: {
                    not: series.id,
                },
                libraryId: series.libraryId,
                name: series.name,
            }
        } else {
            args.where = {
                libraryId: series.libraryId,
                name: series.name,
            }
        }
        try {
            const results = await prisma.series.findMany(args);
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

/**
 * Validate that the name of this Volume is unique within its Library.
 *
 * @param volume                        Volume whose name is to be validated
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const validateVolumeNameUnique = async (volume: Volume): Promise<boolean> => {
    if (volume && volume.name) {
        const args: Prisma.StoryFindManyArgs = {};
        if (volume.id && (volume.id > 0)) {
            args.where = {
                id: {
                    not: volume.id,
                },
                libraryId: volume.libraryId,
                name: volume.name,
            }
        } else {
            args.where = {
                libraryId: volume.libraryId,
                name: volume.name,
            }
        }
        try {
            const results = await prisma.volume.findMany(args);
            return (results.length === 0);
        } catch (error) {
            throw new ServerError(
                error as Error,
                "validateVolumeNameUnique",
            )
        }
    } else {
        return true;
    }
}

