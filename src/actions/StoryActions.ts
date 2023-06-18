"use server"

// actions/StoryActions.ts

/**
 * Server side actions for Story model objects.
 *
 * TODO - deal with many-to-many relationships later.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Prisma,
    Story,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "./LibraryActions";
import prisma from "../prisma";
import {NotFound, NotUnique, ServerError} from "../util/HttpErrors";
import {validateStoryNameUnique} from "../util-prisma/AsyncValidators";
import * as ToModel from "../util-prisma/ToModel";

// Public Types --------------------------------------------------------------

export type StoryPlus = Story & Prisma.StoryGetPayload<{
    include: {
        authorsStories: true,
        // TODO - deal with many-to-many relations somehow
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
    const args: Prisma.StoryFindManyArgs = {
        include: include(query),
        where: {
            id: storyId,
            libraryId: libraryId,
        }
    }
    try {
        const results = await prisma.story.findMany(args);
        if (results && (results.length > 0) && (results[0].libraryId === libraryId)) {
            return results[0] as StoryPlus;
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
export const insert = async (libraryId: number, story: Prisma.StoryCreateInput): Promise<StoryPlus> => {
    const library = await LibraryActions.find(libraryId);
    if (!await validateStoryNameUnique(ToModel.STORY(story))) {
        throw new NotUnique(
            `name: Story name '${story.name}' is already in use in this Library`,
            "StoryActions.insert",
        );
    }
    const args: Prisma.StoryUncheckedCreateInput = {
        ...story,
        libraryId: libraryId,
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
 * @param storyId                       ID of the story to be removed
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
export const update = async (libraryId: number, storyId: number, story: Prisma.StoryUpdateInput): Promise<StoryPlus> => {
    const original = await find(libraryId, storyId);
    if (!await validateStoryNameUnique(ToModel.STORY(original))) {
        throw new NotUnique(
            `name: Story name '${story.name}' is already in use in this Library`,
            "StoryActions.insert",
        );
    }
    try {
        const result = await prisma.story.update({
            data: {
                ...story,
                //id: storyId,            // No cheating
                //libraryId: libraryId,   // No cheating`
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
 * Return the Story instance with the specified storyId, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param name                          Name of the requested Story
 * @param query                         Optional query parameters
 *
 * @throws NotFound                     If no such Story is found
 * @throws ServerError                  If a low level error is thrown
 */
export const exact = async (libraryId: number, name: string, query?: any): Promise<StoryPlus> => {
    const args: Prisma.StoryFindManyArgs = {
        include: include(query),
        where: {
            libraryId: libraryId,
            name: name,
        }
    }
    try {
        const results = await prisma.story.findMany(args);
        if (results && (results.length > 0) && (results[0].libraryId === libraryId)) {
            return results[0] as StoryPlus;
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
            }
        }
    }
    if (query.hasOwnProperty("withVolumes")) {
        include.volumesStories = {
            include: {
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
