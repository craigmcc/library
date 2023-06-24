"use server"

// actions/StoryActions.ts

/**
 * Server side actions for Story model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Prisma,
    Story,
    VolumesStories,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "./AuthorActions";
import * as LibraryActions from "./LibraryActions";
import * as VolumeActions from "./VolumeActions";
import prisma from "../prisma";
import {NotFound, NotUnique, ServerError} from "../util/HttpErrors";
import {validateStoryNameUnique} from "../util-prisma/AsyncValidators";
import * as ToModel from "../util-prisma/ToModel";

// Public Types --------------------------------------------------------------

export type StoryPlus = Story & Prisma.StoryGetPayload<{
    include: {
        authorsStories: true,
        library: true,
        seriesStories: true,
        volumesStories: true,
    }
}>;

// Action CRUD Functions -----------------------------------------------------

/**
 * Return all Story instances that match the specified criteria.
 *
 * @param libraryId                     ID of the Library being queried
 * @param query                         Optional match query parameters
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const all = async (libraryId: number, query?: any): Promise<StoryPlus[]> => {
    const args: Prisma.StoryFindManyArgs = {
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
        const results = await prisma.story.findMany(args);
        return results as StoryPlus[];
    } catch (error) {
        throw new ServerError(
            error as Error,
            "StoryActions.all",
        );
    }
}

/**
 * Return the Story instance with the specified storyId, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param storyId                       ID of the requested Story
 * @param query                         Optional query parameters
 *
 * @throws NotFound                     If no such Story is found
 * @throws ServerError                  If a low level error is thrown
 */
export const find = async (libraryId: number, storyId: number, query?: any): Promise<StoryPlus> => {
    try {
        const result = await prisma.story.findUnique({
            include: include(query),
            where: {
                id: storyId,
                libraryId: libraryId,
            }
        });
        if (result) {
            return result as StoryPlus;
        } else {
            throw new NotFound(
                `id: Missing Story ${storyId}`,
                "StoryActions.find"
            );
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "StoryActions.find",
            );
        }
    }
}

/**
 * Create and return a new Story instance, if it satisfies validation.
 *
 * @param libraryId                     ID of the owning Library
 * @param story                         Story to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (libraryId: number, story: Prisma.StoryUncheckedCreateInput): Promise<StoryPlus> => {
    await LibraryActions.find(libraryId);
    if (!await validateStoryNameUnique(ToModel.STORY({
        ...story,
        libraryId: libraryId,
    }))) {
        throw new NotUnique(
            `name: Story name '${story.name}' is already in use in this Library`,
            "StoryActions.insert",
        );
    }
    const args: Prisma.StoryUncheckedCreateInput = {
        ...story,
        libraryId: libraryId,           // No cheating
    }
    try {
        const result = await prisma.story.create({
            data: args,
        });
        return result as StoryPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "StoryActions.insert",
        );
    }
}

/**
 * Remove and return the specified Story.
 *
 * @param libraryId                     ID of the owning Library
 * @param storyId                       ID of the Story to be removed
 *
 * @throws NotFound                     If the specified Library or Story cannot be found
 * @throws ServerError                  If a low level error is thrown
 */
export const remove = async (libraryId: number, storyId: number): Promise<StoryPlus> => {
    try {
        const story = await find(libraryId, storyId);
        await prisma.story.delete({
            where: { id: storyId },
        });
        return story;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "StoryActions.remove",
        );
    }
}

/**
 * Update and return the specified Story.
 *
 * @param libraryId                     ID of the owning Library
 * @param storyId                       ID of the Story to be updated
 * @param story                         Updated data
 *
 * @throws NotFound                     If the specified Library or Story cannot be found
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If a low level error is thrown
 */
export const update = async (libraryId: number, storyId: number, story: Prisma.StoryUncheckedUpdateInput): Promise<StoryPlus> => {
    await find(libraryId, storyId); // May throw NotFound
    const model: Story = {
        ...ToModel.STORY(story),
        id: storyId,
        libraryId: libraryId,
    }
    if (story.name && (!await validateStoryNameUnique(ToModel.STORY(model)))) {
        throw new NotUnique(
            `name: Story name '${story.name}' is already in use in this Library`,
            "StoryActions.update",
        );
    }
    try {
        const result = await prisma.story.update({
            data: {
                ...story,
                id: storyId,            // No cheating
                libraryId: libraryId,   // No cheating`
            },
            where: { id: storyId },
        });
        return result as StoryPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "StoryActions.update",
        );
    }
}

// Action Unique Functions ---------------------------------------------------

/**
 * Connect the specified Author to this Story.
 *
 * @param libraryId                     ID of the Library being queried
 * @param storyId                       ID of the Story being connected to
 * @param authorId                      ID of the Author being connected
 * @param principal                     Is this a principal Author of this Story?
 *
 * @throws NotFound                     If the specified Story or Author is not found
 * @throws NotUnique                    If this Author and Story are already connected
 * @throws ServerError                  If a low level error is thrown
 */
export const authorConnect =
    async (libraryId: number, storyId: number, authorId: number, principal?: boolean): Promise<StoryPlus> =>
{
    const story = await find(libraryId, storyId);
    await AuthorActions.find(libraryId, authorId);
    try {
        await prisma.authorsStories.create({
            data: {
                authorId: authorId,
                principal: principal,
                storyId: storyId,
            }
        });
        return story;
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
            "StoryActions.authorConnect()",
        );
    }
}

/**
 * Disconnect the specified Author from this Story.
 *
 * @param libraryId                     ID of the Library being queried
 * @param storyId                       ID of the Story being disconnected from
 * @param authorId                      ID of the Author being disconnected
 *
 * @throws NotFound                     If the specified Story or Author is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const authorDisconnect =
    async (libraryId: number, storyId: number, authorId: number): Promise<StoryPlus> =>
{
    const story = await find(libraryId, storyId);
    await AuthorActions.find(libraryId, authorId);
    try {
        await prisma.authorsStories.delete({
            where: {
                authorId_storyId: {
                    authorId: authorId,
                    storyId: storyId,
                }
            },
        });
        return story;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                throw new NotFound(
                    `disconnect: Author ID ${authorId} and Story ID ${storyId} are not connected`,
                    "StoryActions.authorDisconnect",
                );
            }
        }
        throw new ServerError(
            error as Error,
            "StoryActions.authorDisconnect()",
        );
    }
}

/**
 * Return the Story instance with the specified name, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param name                          Name of the requested Story
 * @param query                         Optional query parameters
 *
 * @throws NotFound                     If no such Story is found
 * @throws ServerError                  If a low level error is thrown
 */
export const exact = async (libraryId: number, name: string, query?: any): Promise<StoryPlus> => {
    try {
        const result = await prisma.story.findUnique({
            include: include(query),
            where: {
                libraryId_name: {
                    libraryId: libraryId,
                    name: name,
                }
            }
        });
        if (result) {
            return result as StoryPlus;
        } else {
            throw new NotFound(
                `name: Missing Story '${name}'`,
                "StoryActions.exact"
            );
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "StoryActions.exact",
            );
        }
    }
}

/**
 * Connect the specified Volume to this Story.
 *
 * @param libraryId                     ID of the Library being queried
 * @param storyId                       ID of the Story being connected to
 * @param volumeId                      ID of the Volume being connected
 *
 * @throws NotFound                     If the specified Story or Volume is not found
 * @throws NotUnique                    If this Volume and Story are already connected
 * @throws ServerError                  If a low level error is thrown
 */
export const volumeConnect =
    async (libraryId: number, storyId: number, volumeId: number): Promise<StoryPlus> =>
    {
        const story = await find(libraryId, storyId);
        await VolumeActions.find(libraryId, volumeId);
        try {
            await prisma.volumesStories.create({
                data: {
                    volumeId: volumeId,
                    storyId: storyId,
                }
            });
            return story;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotUnique(
                        `connect: Volume ID ${volumeId} and Story ID ${storyId} are already connected`,
                        "StoryAction.volumeConnect"
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "StoryActions.authorConnect()",
            );
        }
    }

/**
 * Disconnect the specified Author from this Story.
 *
 * @param libraryId                     ID of the Library being queried
 * @param storyId                       ID of the Story being disconnected from
 * @param volumeId                      ID of the Volume being disconnected
 *
 * @throws NotFound                     If the specified Story or Author is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const volumeDisconnect =
    async (libraryId: number, storyId: number, volumeId: number): Promise<StoryPlus> =>
    {
        const story = await find(libraryId, storyId);
        await VolumeActions.find(libraryId, volumeId);
        try {
            await prisma.volumesStories.delete({
                where: {
                    volumeId_storyId: {
                        volumeId: volumeId,
                        storyId: storyId,
                    }
                },
            });
            return story;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFound(
                        `disconnect: Volume ID ${volumeId} and Story ID ${storyId} are not connected`,
                        "StoryActions.volumeDisconnect",
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "StoryActions.volumeDisconnect()",
            );
        }
    }

// Support Functions ---------------------------------------------------------

/**
 * Calculate and return the "include" options from the specified query
 * parameters, if they were specified.
 */
export const include = (query?: any): Prisma.StoryInclude | undefined => {
    if (!query) {
        return undefined;
    }
    const include: Prisma.StoryInclude = {};
    if (query.hasOwnProperty("withAuthors")) {
        include.authorsStories = {
            include: {
                author: true,
                story: true,
            }
        }
    }
    if (query.hasOwnProperty("withLibrary")) {
        include.library = true;
    }
    if (query.hasOwnProperty("withSeries")) {
        include.seriesStories = {
            include: {
                series: true,
                story: true,
            }
        }
    }
    if (query.hasOwnProperty("withVolumes")) {
        include.volumesStories = {
            include: {
                story: true,
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
export const orderBy = (query?: any): Prisma.StoryOrderByWithRelationInput => {
    return {
        name: "asc",
    }
}

/**
 * Calculate and return the "select" options from the specified query
 * parameters, if any were specified.
 */
export const select = (query?: any): Prisma.StorySelect | undefined => {
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
export const where = (libraryId: number, query?: any): Prisma.StoryWhereInput | undefined => {
    const where: Prisma.StoryWhereInput = {
        libraryId: libraryId,
    }
    if (!query) {
        return where;
    }
    if (query.hasOwnProperty("active")) {
        where.active = true;
    }
    if (query.hasOwnProperty("name")) {
        where.name = {
            contains: query.name,
            mode: "insensitive",
        }
    }
    return where;
}

