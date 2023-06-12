// test-prisma/SeedData.ts

/**
 * Seed data for tests of Prisma-based actions.
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {
    Prisma,
} from "@prisma/client";

// Seed Data -----------------------------------------------------------------

// *** Libraries ***

export const LIBRARY_NAME_FIRST = "Test Library";
export const LIBRARY_NAME_SECOND = "Extra Library";
export const LIBRARY_SCOPE_FIRST = "scope1";
export const LIBRARY_SCOPE_SECOND = "scope2";
export const LIBRARY_NAME_THIRD = "Another Library";
export const LIBRARY_SCOPE_THIRD = "scope3";

// NOTE: Tests never touch any libraries except these!!!
export const LIBRARIES: Prisma.LibraryCreateInput[] = [
    {
        name: LIBRARY_NAME_FIRST,
        scope: LIBRARY_SCOPE_FIRST,
    },
    {
        name: LIBRARY_NAME_SECOND,
        scope: LIBRARY_SCOPE_SECOND,
    },
    {
        active: false,
        name: LIBRARY_NAME_THIRD,
        scope: LIBRARY_SCOPE_THIRD,
    }
];

