"use server"

// actions/LibraryActions.ts

/**
 * Server side actions for Library model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Library,
    Prisma,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import prisma from "../prisma";
import {BadRequest, NotFound, NotUnique, ServerError} from "../util/HttpErrors";
import { validateLibraryNameUnique, validateLibraryScopeUnique} from "../util-prisma/AsyncValidators";
import {validateLibraryScope} from "../util/ApplicationValidators";
import * as ToModel from "../util-prisma/ToModel";

// Public Types --------------------------------------------------------------

export type LibraryPlus = Library & Prisma.LibraryGetPayload<{
    include: {
        authors: true,
        series: true,
        stories: true,
        volumes: true,
    }
}>;

// Action CRUD Functions -----------------------------------------------------

/**
 * Return all Library instances that match the specified criteria.
 *
 * @param query                         Optional match query parameters
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const all = async (query?: any): Promise<LibraryPlus[]> => {
    const args: Prisma.LibraryFindManyArgs = {
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
        const results = await prisma.library.findMany(args);
        return results as LibraryPlus[];
    } catch (error) {
        throw new ServerError(
            error as Error,
            "LibraryActions.all",
        )
    }
}

/**
 * Return the Library instance with the specified libraryId, or throw NotFound.
 *
 * @param libraryId                     ID of the requested Library
 * @param query                         Optional include query parameters
 *
 * @throws NotFound                     If no such Library is found
 * @throws ServerError                  If a low level error is thrown
 */
export const find = async (libraryId: number, query?: any): Promise<LibraryPlus> => {
    const args: Prisma.LibraryFindUniqueArgs = {
        include: include(query),
        where: {
            id: libraryId,
        }
    }
    try {
        const result = await prisma.library.findUnique(args);
        if (result) {
            return result as LibraryPlus;
        } else {
            throw new NotFound(
                `id: Missing Library ${libraryId}`,
                "LibraryActions.find"
            )
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "LibraryActions.find",
            )
        }
    }
}

/**
 * Create and return a new Library instance, if it satisfies validation.
 *
 * @param library                       Library to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (library: Prisma.LibraryCreateInput): Promise<LibraryPlus> => {
    const model: Library = ToModel.LIBRARY(library);
    if (!validateLibraryScope(library.scope)) {
        throw new BadRequest(
            `scope: Scope '${library.scope}' must not contain spaces`,
            "LibraryActions.insert",
        );
    }
    if (!await validateLibraryNameUnique(model)) {
        throw new NotUnique(
            `name: Library name '${library.name}' is already in use`,
            "LibraryActions.insert",
        )
    }
    if (!await validateLibraryScopeUnique(model)) {
        throw new NotUnique(
            `scope: Library scope '${library.scope}' is already in use`,
            "LibraryActions.insert",
        )
    }
    const args: Prisma.LibraryCreateArgs = {
        data: library,
    }
    try {
        const result = await prisma.library.create(args);
        return result as LibraryPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "LibraryActions.insert"
        );
    }
}

/**
 * Remove and return the specified Library.
 *
 * @param libraryId                     ID of the Library to be removed
 *
 * @throws NotFound                     If no such Library is found
 * @throws ServerError                  If a low level error is thrown
 */
export const remove = async (libraryId: number): Promise<LibraryPlus> => {
    await find(libraryId); // May throw NotFound
    try {
        const result = await prisma.library.delete({
            where: {
                id: libraryId,
            }
        });
        return result as LibraryPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "LibraryActions.remove",
        );
    }
}

/**
 * Update and return the specified Library.
 *
 * @param libraryId                     ID of the Library to be updated
 * @param library                       Updated data
 *
 * @throws BadRequest                   If validation fails
 * @throws NotFound                     If no such Library is found
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error is thrown
 */
export const update = async (libraryId: number, library: Prisma.LibraryUpdateInput): Promise<LibraryPlus> => {
    const original = await find(libraryId); // May throw NotFound
    const model: Library = {
        ...ToModel.LIBRARY(library),
        id: libraryId,
    }
    if (library.scope && (typeof library.scope === "string") && !validateLibraryScope(library.scope)) {
        throw new BadRequest(
            `scope: Scope '${library.scope}' must not contain spaces`,
            "LibraryActions.update",
        );
    }
    if (library.name && (!await validateLibraryNameUnique(model))) {
        throw new NotUnique(
            `name: Library name '${library.name}' is already in use`,
            "LibraryActions.update",
        )
    }
    if (library.scope && (!await validateLibraryScopeUnique(model))) {
        throw new NotUnique(
            `scope: Library scope '${library.scope}' is already in use`,
            "LibraryActions.update",
        )
    }
    try {
        const result = await prisma.library.update({
            data: {
                ...library,
                id: libraryId,      // No cheating
            },
            where: {
                id: libraryId,
            }
        });
        return result as LibraryPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "LibraryActions.update"
        );
    }
}

// Action Unique Functions ---------------------------------------------------

// TODO - authors()

/**
 * Return the Library instance with the specified name, or throw NotFound.
 *
 * @param name                          Name of the requested Library
 * @param query                         Optional include query parameters
 *
 * @throws NotFound                     If no such Library is found
 * @throws ServerError                  If a low level error is thrown
 */
export const exact = async (name: string, query?: any): Promise<LibraryPlus> => {
    const args: Prisma.LibraryFindUniqueArgs = {
        include: include(query),
        where: {
            name: name,
        }
    }
    try {
        const result = await prisma.library.findUnique(args);
        if (result) {
            return result as LibraryPlus;
        } else {
            throw new NotFound(
                `name: Missing Library '${name}'`,
                "LibraryActions.exact",
            )
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "LibraryActions.exact",
            )
        }
    }
}

// TODO - series()

// TODO - stories()

// TODO - users()

// TODO - usersExact()

// TODO - usersInsert()

// TODO - usersRemove()

// TODO - usersUpdate()

// TODO - volumes()

// Support Functions ---------------------------------------------------------

/**
 * Calculate and return the "include" options from the specified query
 * parameters, if any were specified.
 */
export const include = (query?: any): Prisma.LibraryInclude | undefined => {
    if (!query) {
        return undefined;
    }
    const include: Prisma.LibraryInclude = {};
    if (query.hasOwnProperty("withAuthors")) {
        include.authors = true;
    }
    if (query.hasOwnProperty("withSeries")) {
        include.series = true;
    }
    if (query.hasOwnProperty("withStories")) {
        include.stories = true;
    }
    if (query.hasOwnProperty("withVolumes")) {
        include.volumes = true;
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
export const orderBy = (query?: any): Prisma.LibraryOrderByWithRelationInput => {
    return {
        name: "asc",
    }
}

/**
 * Calculate and return the "select" options from the specified query
 * parameters, if any were specified.
 */
export const select = (query?: any): Prisma.LibrarySelect | undefined => {
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
export const where = (query?: any): Prisma.LibraryWhereInput | undefined => {
    if (!query) {
        return undefined;
    }
    const where: Prisma.LibraryWhereInput = {};
    if (query.hasOwnProperty("active")) {
        where.active = true;
    }
    if (query.hasOwnProperty("name")) {
        where.name = {              // TODO - verify that this does an "ilike"
            contains: query.name,
            mode: "insensitive",
        }
    }
    if (query.hasOwnProperty("scope")) {
        where.scope = {
            equals: query.scope,
        }
    }
    if (Object.keys(where).length > 0) {
        return where;
    } else {
        return undefined;
    }
}
