"use server"

// actions/SeriesActions.ts

/**
 * Server side actions for Series model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    AuthorsSeries,
    Prisma,
    Series,
    SeriesStories,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "./AuthorActions";
import * as LibraryActions from "./LibraryActions";
import * as StoryActions from "./StoryActions";
import prisma from "../prisma";
import {NotFound, NotUnique, ServerError} from "../util/HttpErrors";
import {validateSeriesNameUnique} from "../util-prisma/AsyncValidators";
import * as ToModel from "../util-prisma/ToModel";

// Public Types --------------------------------------------------------------

export type SeriesPlus = Series & Prisma.SeriesGetPayload<{
    include: {
        authorsSeries: true,
        library: true,
        seriesStories: true,
    }
}>;

export type SeriesStoriesPlus = SeriesStories & Prisma.SeriesStoriesGetPayload<{
    include: {
        series: true,
        story: true,
    }
}>;

// Action CRUD Functions -----------------------------------------------------

/**
 * Return all Series instances that match the specified criteria.
 *
 * @param libraryId                     ID of the Library being queried
 * @param query                         Optional match query parameters
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const all = async (libraryId: number, query?: any): Promise<SeriesPlus[]> => {
    const args: Prisma.SeriesFindManyArgs = {
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
        const results = await prisma.series.findMany(args);
        return results as SeriesPlus[];
    } catch (error) {
        throw new ServerError(
            error as Error,
            "SeriesActions.all",
        );
    }
}

/**
 * Return the Series instance with the specified seriesId, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param seriesId                      ID of the requested Series
 * @param query                         Optional query parameters
 *
 * @throws NotFound                     If no such Series is found
 * @throws ServerError                  If a low level error is thrown
 */
export const find = async (libraryId: number, seriesId: number, query?: any): Promise<SeriesPlus> => {
    try {
        const result = await prisma.series.findUnique({
            include: include(query),
            where: {
                id: seriesId,
                libraryId: libraryId,
            }
        });
        if (result) {
            return result as SeriesPlus;
        } else {
            throw new NotFound(
                `id: Missing Series ${seriesId}`,
                "SeriesActions.find"
            );
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "SeriesActions.find",
            );
        }
    }
}

/**
 * Create and return a new Series instance, if it satisfies validation.
 *
 * @param libraryId                     ID of the owning Library
 * @param series                        Series to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (libraryId: number, series: Prisma.SeriesUncheckedCreateInput): Promise<SeriesPlus> => {
    await LibraryActions.find(libraryId);
    if (!await validateSeriesNameUnique(ToModel.SERIES({
        ...series,
        libraryId: libraryId,
    }))) {
        throw new NotUnique(
            `name: Series name '${series.name}' is already in use in this Library`,
            "SeriesActions.insert",
        );
    }
    const args: Prisma.SeriesUncheckedCreateInput = {
        ...series,
        libraryId: libraryId,           // No cheating
    }
    try {
        const result = await prisma.series.create({
            data: args,
        });
        return result as SeriesPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "SeriesActions.insert",
        );
    }
}

/**
 * Remove and return the specified Series.
 *
 * @param libraryId                     ID of the owning Library
 * @param seriesId                      ID of the Series to be removed
 *
 * @throws NotFound                     If the specified Library or Series cannot be found
 * @throws ServerError                  If a low level error is thrown
 */
export const remove = async (libraryId: number, seriesId: number): Promise<SeriesPlus> => {
    try {
        const story = await find(libraryId, seriesId);
        await prisma.series.delete({
            where: { id: seriesId },
        });
        return story;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "SeriesActions.remove",
        );
    }
}

/**
 * Update and return the specified Series.
 *
 * @param libraryId                     ID of the owning Library
 * @param seriesId                      ID of the Series to be updated
 * @param series                        Updated data
 *
 * @throws NotFound                     If the specified Library or Series cannot be found
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If a low level error is thrown
 */
export const update = async (libraryId: number, seriesId: number, series: Prisma.SeriesUncheckedUpdateInput): Promise<SeriesPlus> => {
    await find(libraryId, seriesId); // May throw NotFound
    const model: Series = {
        ...ToModel.SERIES(series),
        id: seriesId,
        libraryId: libraryId,
    }
    if (series.name && (!await validateSeriesNameUnique(ToModel.SERIES(model)))) {
        throw new NotUnique(
            `name: Series name '${series.name}' is already in use in this Library`,
            "SeriesActions.update",
        );
    }
    try {
        const result = await prisma.series.update({
            data: {
                ...series,
                id: seriesId,            // No cheating
                libraryId: libraryId,   // No cheating`
            },
            where: { id: seriesId },
        });
        return result as SeriesPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "SeriesActions.update",
        );
    }
}

// Action Unique Functions ---------------------------------------------------

/**
 * Connect the specified Author to this Series.
 *
 * @param libraryId                     ID of the Library being queried
 * @param seriesId                      ID of the Series being connected to
 * @param authorId                      ID of the Author being connected
 * @param principal                     Is this a principal Author of this Series?
 *
 * @throws NotFound                     If the specified Series or Author is not found
 * @throws NotUnique                    If this Author and Series are already connected
 * @throws ServerError                  If a low level error is thrown
 */
export const authorConnect =
    async (libraryId: number, seriesId: number, authorId: number, principal?: boolean): Promise<SeriesPlus> =>
    {
        const story = await find(libraryId, seriesId);
        await AuthorActions.find(libraryId, authorId);
        try {
            await prisma.authorsSeries.create({
                data: {
                    authorId: authorId,
                    principal: principal,
                    seriesId: seriesId,
                }
            });
            return story;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotUnique(
                        `connect: Author ID ${authorId} and Series ID ${seriesId} are already connected`,
                        "SeriesAction.authorConnect"
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "SeriesActions.authorConnect()",
            );
        }
    }

/**
 * Disconnect the specified Author from this Series.
 *
 * @param libraryId                     ID of the Library being queried
 * @param seriesId                      ID of the Series being disconnected from
 * @param authorId                      ID of the Author being disconnected
 *
 * @throws NotFound                     If the specified Series or Author is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const authorDisconnect =
    async (libraryId: number, seriesId: number, authorId: number): Promise<SeriesPlus> =>
    {
        const story = await find(libraryId, seriesId);
        await AuthorActions.find(libraryId, authorId);
        try {
            await prisma.authorsSeries.delete({
                where: {
                    authorId_seriesId: {
                        authorId: authorId,
                        seriesId: seriesId,
                    }
                },
            });
            return story;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFound(
                        `disconnect: Author ID ${authorId} and Series ID ${seriesId} are not connected`,
                        "SeriesActions.authorDisconnect",
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "SeriesActions.authorDisconnect()",
            );
        }
    }

/**
 * Return the Series instance with the specified name, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param name                          Name of the requested Series
 * @param query                         Optional query parameters
 *
 * @throws NotFound                     If no such Series is found
 * @throws ServerError                  If a low level error is thrown
 */
export const exact = async (libraryId: number, name: string, query?: any): Promise<SeriesPlus> => {
    try {
        const result = await prisma.series.findUnique({
            include: include(query),
            where: {
                libraryId_name: {
                    libraryId,
                    name: name,
                },
            }
        });
        if (result) {
            return result as SeriesPlus;
        } else {
            throw new NotFound(
                `name: Missing Series '${name}'`,
                "SeriesActions.exact"
            );
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "SeriesActions.exact",
            );
        }
    }
}

/**
 * Connect the specified Story to this Series.
 *
 * @param libraryId                     ID of the Library being queried
 * @param seriesId                      ID of the Series being connected to
 * @param storyId                       ID of the Volume being connected
 *
 * @throws NotFound                     If the specified Series or Story is not found
 * @throws NotUnique                    If this Series and Story are already connected
 * @throws ServerError                  If a low level error is thrown
 */
export const storyConnect =
    async (libraryId: number, seriesId: number, storyId: number, ordinal?: number): Promise<SeriesPlus> =>
    {
        const series = await find(libraryId, seriesId);
        await StoryActions.find(libraryId, storyId);
        try {
            await prisma.seriesStories.create({
                data: {
                    ordinal: ordinal ? ordinal : undefined,
                    seriesId: seriesId,
                    storyId: storyId,
                }
            });
            return series;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotUnique(
                        `connect: Series ID ${seriesId} and Story ID ${storyId} are already connected`,
                        "SeriesAction.storyConnect"
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "SeriesActions.storyConnect()",
            );
        }
    }

/**
 * Disconnect the specified Story from this Series.
 *
 * @param libraryId                     ID of the Library being queried
 * @param seriesId                      ID of the Series being disconnected from
 * @param storyId                       ID of the Volume being disconnected
 *
 * @throws NotFound                     If the specified Series or Story is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const storyDisconnect =
    async (libraryId: number, seriesId: number, storyId: number): Promise<SeriesPlus> =>
    {
        const series = await find(libraryId, seriesId);
        await StoryActions.find(libraryId, storyId);
        try {
            await prisma.seriesStories.delete({
                where: {
                    seriesId_storyId: {
                        seriesId: seriesId,
                        storyId: storyId,
                    }
                },
            });
            return series;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFound(
                        `disconnect: Series ID ${seriesId} and Story ID ${storyId} are not connected`,
                        "SeriesActions.storyDisconnect",
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "SeriesActions.storyDisconnect()",
            );
        }
    }

// Support Functions ---------------------------------------------------------

/**
 * Calculate and return the "include" options from the specified query
 * parameters, if they were specified.
 */
export const include = (query?: any): Prisma.SeriesInclude | undefined => {
    if (!query) {
        return undefined;
    }
    const include: Prisma.SeriesInclude = {};
    if (query.hasOwnProperty("withAuthors")) {
        include.authorsSeries = {
            include: {
                author: true,
                series: true,
            }
        }
    }
    if (query.hasOwnProperty("withLibrary")) {
        include.library = true;
    }
    if (query.hasOwnProperty("withStories")) {
        include.seriesStories = {
            include: {
                series: true,
                story: true,
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
export const orderBy = (query?: any): Prisma.SeriesOrderByWithRelationInput => {
    return {
        name: "asc",
    }
}

/**
 * Calculate and return the "select" options from the specified query
 * parameters, if any were specified.
 */
export const select = (query?: any): Prisma.SeriesSelect | undefined => {
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
export const where = (libraryId: number, query?: any): Prisma.SeriesWhereInput | undefined => {
    const where: Prisma.SeriesWhereInput = {
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

