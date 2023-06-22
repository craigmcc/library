"use server"

// actions/AuthorActions.ts

/**
 * Server side actions for Author model objects.
 *
 * TODO - deal with many-to-many relationships later.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Author,
    AuthorsStories,
    Prisma,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "./LibraryActions";
import * as StoryActions from "./StoryActions";
import prisma from "../prisma";
import {NotFound, NotUnique, ServerError} from "../util/HttpErrors";
import {validateAuthorNameUnique} from "../util-prisma/AsyncValidators";
import * as ToModel from "../util-prisma/ToModel";

// Public Types --------------------------------------------------------------

export type AuthorPlus = Author & Prisma.AuthorGetPayload<{
    include: {
        authorsSeries: true,
        authorsStories: true,
        library: true,
        authorsVolumes: true,
    }
}>;

export type AuthorsStoriesPlus = AuthorsStories & Prisma.AuthorsStoriesGetPayload<{
    include: {
        author: true,
        story: true,
    }
}>;

// Action CRUD Functions -----------------------------------------------------

/**
 * Return all Author instances that match the specified criteria.
 *
 * @param libraryId                     ID of the Library being queried
 * @param query                         Optional match query parameters
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const all = async (libraryId: number, query?: any): Promise<AuthorPlus[]> => {
    const args: Prisma.AuthorFindManyArgs = {
        // cursor???
        // distinct???
        include: include(query),
        orderBy: orderBy(query),
        select: select(query),
        skip: skip(query),
        take: take(query),
        where: where(libraryId, query),
    }
    try {
        const results = await prisma.author.findMany(args);
        return results as AuthorPlus[];
    } catch (error) {
        throw new ServerError(
            error as Error,
            "AuthorActions.all",
        );
    }
}

/**
 * Return the Author instance with the specified authorId, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param authorId                      ID of the requested Author
 * @param query                         Optional query parameters
 *
 * @throws NotFound                     If no such Author is found
 * @throws ServerError                  If a low level error is thrown
 */
export const find = async (libraryId: number, authorId: number, query?: any): Promise<AuthorPlus> => {
    const args: Prisma.AuthorFindManyArgs = {
        include: include(query),
        where: {
            id: authorId,
            libraryId: libraryId,
        }
    }
    try {
        const results = await prisma.author.findMany(args);
        if (results && (results.length > 0) && (results[0].libraryId === libraryId)) {
            return results[0] as AuthorPlus;
        } else {
            throw new NotFound(
                `id: Missing Author ${authorId}`,
                "AuthorActions.find"
            );
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "AuthorActions.find",
            );
        }
    }
}

/**
 * Create and return a new Author instance, if it satisfies validation.
 *
 * @param libraryId                     ID of the owning Library
 * @param author                        Author to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (libraryId: number, author: Prisma.AuthorUncheckedCreateInput): Promise<AuthorPlus> => {
    await LibraryActions.find(libraryId);
    if (!await validateAuthorNameUnique(ToModel.AUTHOR({
        ...author,
        libraryId: libraryId,
    }))) {
        throw new NotUnique(
            `name: Author name '${author.firstName} ${author.lastName}' is already in use in this Library`,
            "AuthorActions.insert",
        );
    }
    const args: Prisma.AuthorUncheckedCreateInput = {
        ...author,
        libraryId: libraryId,           // No cheating
    }
    try {
        const result = await prisma.author.create({
            data: args,
        });
        return result as AuthorPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "AuthorActions.insert",
        );
    }
}

/**
 * Remove and return the specified Author.
 *
 * @param libraryId                     ID of the owning Library
 * @param authorId                      ID of the Author to be removed
 *
 * @throws NotFound                     If the specified Library or Author cannot be found
 * @throws ServerError                  If a low level error is thrown
 */
export const remove = async (libraryId: number, authorId: number): Promise<AuthorPlus> => {
    try {
        const author = await find(libraryId, authorId);
        await prisma.author.delete({
            where: { id: authorId },
        });
        return author;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "AuthorActions.remove",
        );
    }
}

/**
 * Update and return the specified Author.
 *
 * @param libraryId                     ID of the owning Library
 * @param authorId                      ID of the Author to be updated
 * @param author                        Updated data
 *
 * @throws NotFound                     If the specified Library or Author cannot be found
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If a low level error is thrown
 */
export const update = async (libraryId: number, authorId: number, author: Prisma.AuthorUncheckedUpdateInput): Promise<AuthorPlus> => {
    await find(libraryId, authorId); // May throw NotFound
    const model: Author = {
        ...ToModel.AUTHOR(author),
        id: authorId,
        libraryId: libraryId,
    }
    if (author.firstName && author.lastName && (!await validateAuthorNameUnique(ToModel.AUTHOR(model)))) {
        throw new NotUnique(
            `name: Author name '${author.firstName} ${author.lastName}' is already in use in this Library`,
            "AuthorActions.update",
        );
    }
    try {
        const result = await prisma.author.update({
            data: {
                ...author,
                id: authorId,           // No cheating
                libraryId: libraryId,   // No cheating`
            },
            where: { id: authorId },
        });
        return result as AuthorPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "AuthorActions.update",
        );
    }
}

// Action Unique Functions ---------------------------------------------------

/**
 * Return the Author instance with the specified name, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param firstName                     First name of the requested Author
 * @param lastName                      Last name of the requested Author
 * @param query                         Optional query parameters
 *
 * @throws NotFound                     If no such Author is found
 * @throws ServerError                  If a low level error is thrown
 */
export const exact =
    async (libraryId: number, firstName: string, lastName: string, query?: any): Promise<AuthorPlus> =>
    {
        const args: Prisma.AuthorFindManyArgs = {
            include: include(query),
            where: {
                firstName: firstName,
                lastName: lastName,
                libraryId: libraryId,
            }
        }
        try {
            const results = await prisma.author.findMany(args);
            if (results && (results.length > 0) && (results[0].libraryId === libraryId)) {
                return results[0] as AuthorPlus;
            } else {
                throw new NotFound(
                    `name: Missing Author '${firstName} ${lastName}'`,
                    "AuthorActions.exact"
                );
            }
        } catch (error) {
            if (error instanceof NotFound) {
                throw error;
            } else {
                throw new ServerError(
                    error as Error,
                    "AuthorActions.exact",
                );
            }
        }
    }

/**
 * Connect the specified Story to this Author.
 *
 * @param libraryId                     ID of the Library being queried
 * @param authorId                      ID of the Author being connected to
 * @param storyId                       ID of the Story being connected
 * @param principal                     Is this a principal Author of this Story?
 *
 * @throws NotFound                     If the specified Author or Story is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const storyConnect =
    async (libraryId: number, authorId: number, storyId: number, principal?: boolean): Promise<AuthorPlus> =>
    {
        const author = await find(libraryId, authorId);
        await StoryActions.find(libraryId, storyId);
        try {
            await prisma.authorsStories.create({
                data: {
                    authorId: authorId,
                    principal: principal,
                    storyId: storyId,
                }
            });
            return author;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotUnique(
                        `connect: Author ID ${authorId} and Story ID ${storyId} are already connected`,
                        "StoryAction.authorConnect"
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "AuthorActions.storyConnect()",
            );
        }
    }

/**
 * Disconnect the specified Story from this Author.
 *
 * @param libraryId                     ID of the Library being queried
 * @param authorId                      ID of the Author being disconnected from
 * @param storyId                       ID of the Story being disconnected
 *
 * @throws NotFound                     If the specified Author or Story is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const storyDisconnect =
    async (libraryId: number, authorId: number, storyId: number): Promise<AuthorPlus> =>
    {
        const author = await find(libraryId, authorId);
        await StoryActions.find(libraryId, storyId);
        try {
            await prisma.authorsStories.delete({
                where: {
                    authorId_storyId: {
                        authorId: authorId,
                        storyId: storyId,
                    }
                },
            });
            return author;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFound(
                        `disconnect: Author ID ${authorId} and Story ID ${storyId} are not connected`,
                        "AuthorActions.storyDisconnect",
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "AuthorActions.storyConnect()",
            );
        }

    }

// Support Functions ---------------------------------------------------------

/**
 * Calculate and return the "include" options from the specified query
 * parameters, if they were specified.
 */
export const include = (query?: any): Prisma.AuthorInclude | undefined => {
    if (!query) {
        return undefined;
    }
    const include: Prisma.AuthorInclude = {};
    if (query.hasOwnProperty("withLibrary")) {
        include.library = true;
    }
    if (query.hasOwnProperty("withSeries")) {
        include.authorsSeries = {
            include: {
                author: true,
                series: true,
            }
        }
    }
    if (query.hasOwnProperty("withStories")) {
        include.authorsStories = {
            include: {
                author: true,
                story: true,
            }
        }
    }
    if (query.hasOwnProperty("withVolumes")) {
        include.authorsVolumes = {
            include: {
                author: true,
                volume: true,
            }
        }
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
export const orderBy = (query?: any): Prisma.AuthorOrderByWithRelationInput[] => {
    return [
        { lastName: "asc" },
        { firstName: "asc"},
    ];
}

/**
 * Calculate and return the "select" options from the specified query
 * parameters, if any were specified.
 */
export const select = (query?: any): Prisma.AuthorSelect | undefined => {
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
export const where = (libraryId: number, query?: any): Prisma.AuthorWhereInput | undefined => {
    // Special case for name matching
    if (query && query.hasOwnProperty("name")) {
        const names = query.name.trim().split(" ");
        const firstMatch = names[0];
        const lastMatch = (names.length > 1) ? names[1] : names[0]
        const where:  Prisma.AuthorWhereInput = {
            OR: [
                {
                    firstName: {
                        contains: firstMatch,
                        mode: "insensitive",
                    },
                },
                {
                    lastName: {
                        contains: lastMatch,
                        mode: "insensitive",
                    },
                },
            ],
            AND: {
                libraryId: libraryId,
            },
        }
        return where;
    }
    // Standard handling for other filter options
    const where: Prisma.AuthorWhereInput = {
        libraryId: libraryId,
    }
    if (!query) {
        return where;
    }
    if (query.hasOwnProperty("active")) {
        where.active = true;
    }
/*
    if (query.hasOwnProperty("name")) {
        const names = query.name.trim().split(" ");
        const firstMatch = names[0];
        const lastMatch = (names.length > 1) ? names[1] : names[0]
        where.OR = {
            firstName: {
                contains: firstMatch,
                mode: "insensitive",
            },
            lastName: {
                contains: lastMatch,
                mode: "insensitive",
            }
        }
    }
*/
    return where;
}
