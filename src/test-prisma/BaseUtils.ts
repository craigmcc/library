// test-prisma/BaseUtils.ts

/**
 * Base utilities for Prisma-based functional tests of actions.
 */

// External Modules ----------------------------------------------------------

import {
    Library,
    Prisma,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

// TODO - clearMapping() and hashPassword()
import * as SeedData from "./SeedData";
import prisma from "../prisma";

// Public Objects ------------------------------------------------------------

export type OPTIONS = {
    withAccessTokens: boolean,
    withAuthors: boolean,
    withLibraries: boolean,
    withRefreshTokens: boolean,
    withSeries: boolean,
    withStories: boolean,
    withUsers: boolean,
    withVolumes: boolean,
}

/**
 * Erase the current database, then load seed data for the tables
 * selected in the options parameter.
 *
 * @param options                   Flags to select tables to be loaded
 */
export const loadData = async (options: Partial<OPTIONS>): Promise<void> => {

    // TODO - Clear any previous OAuth mapping for Library id -> scope
    // clearMapping();

    // Erase current (test) database contents completely
    // (Relies on "onDelete:cascade" settings in the schema)
    prisma.library.deleteMany({});
    prisma.user.deleteMany({});

    // Load users (and tokens) if requested
    // TODO

    // If libraries are not requested, nothing else will be loaded
    let libraries: Library[] = [];
    if (options.withLibraries) {
        libraries = await loadLibraries(SeedData.LIBRARIES);
        // TODO - load subordinate tables
    } else {
        return;
    }

}

// Private Methods -----------------------------------------------------------

const loadLibraries = async (libraries: Prisma.LibraryCreateInput[]): Promise<Library[]> =>
{
    let results: Library[] = [];
    try {
        libraries.forEach(async library => {
            results.push(await prisma.library.create({ data: library}));
        })
    } catch (error) {
        console.info("  Reloading Libraries ERROR", error);
    }
    return results;
}
