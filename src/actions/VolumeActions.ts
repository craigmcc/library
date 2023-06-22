"use server"

// actions/VolumeActions.ts

/**
 * Server side actions for Volume model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Prisma,
    Volume,
    VolumesStories,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "./AuthorActions";
import * as LibraryActions from "./LibraryActions";
import * as StoryActions from "./StoryActions";
import prisma from "../prisma";
import {BadRequest, NotFound, NotUnique, ServerError} from "../util/HttpErrors";
import {validateVolumeLocation, validateVolumeType} from "../util/ApplicationValidators";
import {validateVolumeNameUnique} from "../util-prisma/AsyncValidators";
import * as ToModel from "../util-prisma/ToModel";

// Public Types --------------------------------------------------------------

export type VolumePlus = Volume & Prisma.VolumeGetPayload<{
    include: {
        authorsVolumes: true,
        library: true,
        volumesStories: true,
    }
}>;

export type VolumesStoriesPlus = VolumesStories & Prisma.VolumesStoriesGetPayload<{
    include: {
        story: true,
        volume: true,
    }
}>;

// Action CRUD Functions -----------------------------------------------------

/**
 * Return all Volume instances that match the specified criteria.
 *
 * @param libraryId                     ID of the Library being queried
 * @param query                         Optional match query parameters
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const all = async (libraryId: number, query?: any): Promise<VolumePlus[]> => {
    const args: Prisma.VolumeFindManyArgs = {
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
        const results = await prisma.volume.findMany(args);
        return results as VolumePlus[];
    } catch (error) {
        throw new ServerError(
            error as Error,
            "VolumeActions.all",
        );
    }
}

/**
 * Return the Volume instance with the specified volumeId, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param volumeId                      ID of the requested Volume
 * @param query                         Optional query parameters
 *
 * @throws NotFound                     If no such Volume is found
 * @throws ServerError                  If a low level error is thrown
 */
export const find = async (libraryId: number, volumeId: number, query?: any): Promise<VolumePlus> => {
    const args: Prisma.VolumeFindManyArgs = {
        include: include(query),
        where: {
            id: volumeId,
            libraryId: libraryId,
        }
    }
    try {
        const results = await prisma.volume.findMany(args);
        if (results && (results.length > 0) && (results[0].libraryId === libraryId)) {
            return results[0] as VolumePlus;
        } else {
            throw new NotFound(
                `id: Missing Volume ${volumeId}`,
                "VolumeActions.find"
            );
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "VolumeActions.find",
            );
        }
    }
}

/**
 * Create and return a new Volume instance, if it satisfies validation.
 *
 * @param libraryId                     ID of the owning Library
 * @param volume                        Volume to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (libraryId: number, volume: Prisma.VolumeUncheckedCreateInput): Promise<VolumePlus> => {
    await LibraryActions.find(libraryId);
    if (!validateVolumeLocation(volume.location)) {
        throw new BadRequest(
            `location:  Invalid Volume location '${volume.location}'`,
            "VolumeActions.insert",
        );
    }
    if (!validateVolumeType(volume.type)) {
        throw new BadRequest(
            `type: Invalid Volume type '${volume.type}'`,
            "VolumeActions.insert",
        );
    }
    if (!await validateVolumeNameUnique(ToModel.VOLUME({
        ...volume,
        libraryId: libraryId,
    }))) {
        throw new NotUnique(
            `name: Volume name '${volume.name}' is already in use in this Library`,
            "VolumeActions.insert",
        );
    }
    const args: Prisma.VolumeUncheckedCreateInput = {
        ...volume,
        libraryId: libraryId,           // No cheating
    }
    try {
        const result = await prisma.volume.create({
            data: args,
        });
        return result as VolumePlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "VolumeActions.insert",
        );
    }
}

/**
 * Remove and return the specified Volume.
 *
 * @param libraryId                     ID of the owning Library
 * @param volumeId                      ID of the Volume to be removed
 *
 * @throws NotFound                     If the specified Library or Volume cannot be found
 * @throws ServerError                  If a low level error is thrown
 */
export const remove = async (libraryId: number, volumeId: number): Promise<VolumePlus> => {
    try {
        const story = await find(libraryId, volumeId);
        await prisma.volume.delete({
            where: { id: volumeId },
        });
        return story;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "VolumeActions.remove",
        );
    }
}

/**
 * Update and return the specified Volume.
 *
 * @param libraryId                     ID of the owning Library
 * @param volumeId                      ID of the Volume to be updated
 * @param volume                         Updated data
 *
 * @throws NotFound                     If the specified Library or Volume cannot be found
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If a low level error is thrown
 */
export const update = async (libraryId: number, volumeId: number, volume: Prisma.VolumeUncheckedUpdateInput): Promise<VolumePlus> => {
    await find(libraryId, volumeId); // May throw NotFound
    if (!validateVolumeLocation((typeof volume.location === "string") ? volume.location : null)) {
        throw new BadRequest(
            `location:  Invalid Volume location '${volume.location}'`,
            "VolumeActions.update",
        );
    }
    if (!validateVolumeType((typeof volume.type === "string") ? volume.type : null)) {
        throw new BadRequest(
            `type: Invalid Volume type '${volume.type}'`,
            "VolumeActions.update",
        );
    }
    const model: Volume = {
        ...ToModel.VOLUME(volume),
        id: volumeId,
        libraryId: libraryId,
    }
    if (volume.name && (!await validateVolumeNameUnique(ToModel.VOLUME(model)))) {
        throw new NotUnique(
            `name: Volume name '${volume.name}' is already in use in this Library`,
            "VolumeActions.update",
        );
    }
    try {
        const result = await prisma.volume.update({
            data: {
                ...volume,
                id: volumeId,           // No cheating
                libraryId: libraryId,   // No cheating`
            },
            where: { id: volumeId },
        });
        return result as VolumePlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "VolumeActions.update",
        );
    }
}

// Action Unique Functions ---------------------------------------------------

/**
 * Connect the specified Author to this Volume.
 *
 * @param libraryId                     ID of the Library being queried
 * @param volumeId                      ID of the Volume being connected to
 * @param authorId                      ID of the Author being connected
 * @param principal                     Is this a principal Author of this Volume?
 *
 * @throws NotFound                     If the specified Volume or Author is not found
 * @throws NotUnique                    If this Author and Volume are already connected
 * @throws ServerError                  If a low level error is thrown
 */
export const authorConnect =
    async (libraryId: number, volumeId: number, authorId: number, principal?: boolean): Promise<VolumePlus> =>
    {
        const story = await find(libraryId, volumeId);
        await AuthorActions.find(libraryId, authorId);
        try {
            await prisma.authorsVolumes.create({
                data: {
                    authorId: authorId,
                    principal: principal,
                    volumeId: volumeId,
                }
            });
            return story;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotUnique(
                        `connect: Author ID ${authorId} and Volume ID ${volumeId} are already connected`,
                        "VolumeAction.authorConnect"
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "VolumeActions.authorConnect()",
            );
        }
    }

/**
 * Disconnect the specified Author from this Volume.
 *
 * @param libraryId                     ID of the Library being queried
 * @param volumeId                      ID of the Volume being disconnected from
 * @param authorId                      ID of the Author being disconnected
 *
 * @throws NotFound                     If the specified Volume or Author is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const authorDisconnect =
    async (libraryId: number, volumeId: number, authorId: number): Promise<VolumePlus> =>
    {
        const story = await find(libraryId, volumeId);
        await AuthorActions.find(libraryId, authorId);
        try {
            await prisma.authorsVolumes.delete({
                where: {
                    authorId_volumeId: {
                        authorId: authorId,
                        volumeId: volumeId,
                    }
                },
            });
            return story;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFound(
                        `disconnect: Author ID ${authorId} and Volume ID ${volumeId} are not connected`,
                        "VolumeActions.authorDisconnect",
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "VolumeActions.authorDisconnect()",
            );
        }
    }

/**
 * Return the Volume instance with the specified name, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param name                          Name of the requested Volume
 * @param query                         Optional query parameters
 *
 * @throws NotFound                     If no such Volume is found
 * @throws ServerError                  If a low level error is thrown
 */
export const exact = async (libraryId: number, name: string, query?: any): Promise<VolumePlus> => {
    const args: Prisma.VolumeFindManyArgs = {
        include: include(query),
        where: {
            libraryId: libraryId,
            name: name,
        }
    }
    try {
        const results = await prisma.volume.findMany(args);
        if (results && (results.length > 0) && (results[0].libraryId === libraryId)) {
            return results[0] as VolumePlus;
        } else {
            throw new NotFound(
                `name: Missing Volume '${name}'`,
                "VolumeActions.exact"
            );
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "VolumeActions.exact",
            );
        }
    }
}

/**
 * Connect the specified Story to this Volume.
 *
 * @param libraryId                     ID of the Library being queried
 * @param volumeId                      ID of the Volume being connected to
 * @param storyId                       ID of the Story being connected
 *
 * @throws NotFound                     If the specified Volume or Story is not found
 * @throws NotUnique                    If this Story and Volume are already connected
 * @throws ServerError                  If a low level error is thrown
 */
export const storyConnect =
    async (libraryId: number, volumeId: number, storyId: number): Promise<VolumePlus> =>
    {
        const volume = await find(libraryId, volumeId);
        await StoryActions.find(libraryId, storyId);
        try {
            await prisma.volumesStories.create({
                data: {
                    storyId: storyId,
                    volumeId: volumeId,
                }
            });
            return volume;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotUnique(
                        `connect: Story ID ${storyId} and Volume ID ${volumeId} are already connected`,
                        "VolumeAction.storyConnect"
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "VolumeActions.storyConnect()",
            );
        }
    }

/**
 * Disconnect the specified Story from this Volume.
 *
 * @param libraryId                     ID of the Library being queried
 * @param volumeId                      ID of the Volume being disconnected from
 * @param storyId                       ID of the Story being disconnected
 *
 * @throws NotFound                     If the specified Volume or Author is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const storyDisconnect =
    async (libraryId: number, volumeId: number, storyId: number): Promise<VolumePlus> =>
    {
        const volume = await find(libraryId, volumeId);
        await StoryActions.find(libraryId, storyId);
        try {
            await prisma.volumesStories.delete({
                where: {
                    volumeId_storyId: {
                        storyId: storyId,
                        volumeId: volumeId,
                    }
                },
            });
            return volume;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFound(
                        `disconnect: Story ID ${storyId} and Volume ID ${volumeId} are not connected`,
                        "VolumeActions.authorDisconnect",
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "VolumeActions.authorDisconnect()",
            );
        }
    }

// Support Functions ---------------------------------------------------------

/**
 * Calculate and return the "include" options from the specified query
 * parameters, if they were specified.
 */
export const include = (query?: any): Prisma.VolumeInclude | undefined => {
    if (!query) {
        return undefined;
    }
    const include: Prisma.VolumeInclude = {};
    if (query.hasOwnProperty("withAuthors")) {
        include.authorsVolumes = {
            include: {
                author: true,
                volume: true,
            }
        }
    }
    if (query.hasOwnProperty("withLibrary")) {
        include.library = true;
    }
    if (query.hasOwnProperty("withStories")) {
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
export const orderBy = (query?: any): Prisma.VolumeOrderByWithRelationInput => {
    return {
        name: "asc",
    }
}

/**
 * Calculate and return the "select" options from the specified query
 * parameters, if any were specified.
 */
export const select = (query?: any): Prisma.VolumeSelect | undefined => {
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
export const where = (libraryId: number, query?: any): Prisma.VolumeWhereInput | undefined => {
    const where: Prisma.VolumeWhereInput = {
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

