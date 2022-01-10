// SeedData ------------------------------------------------------------------

// Mock data for the unit tests using mock service workers.

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from "../models/Library";

// Public Objects ------------------------------------------------------------

// ----- Libraries -----------------------------------------------------------

export const LIBRARY0_ID = 123;
export const LIBRARY1_ID = 456;
export const LIBRARY2_ID = 789;

export const LIBRARIES: Library[] = [
    new Library({
        id: LIBRARY0_ID,
        active: true,
        name: "Library Zero",
        notes: null,
        scope: "zero",
    }),
    new Library({
        id: LIBRARY1_ID,
        active: true,
        name: "Library One",
        notes: null,
        scope: "one",
    }),
    new Library({
        id: LIBRARY2_ID,
        active: true,
        name: "Library Two",
        notes: null,
        scope: "two",
    }),
];

// ----- Authors -------------------------------------------------------------

export const AUTHORS0_0_ID = (LIBRARY0_ID * 10) + 0;
export const AUTHORS0_1_ID = (LIBRARY0_ID * 10) + 1;
export const AUTHORS0_2_ID = (LIBRARY0_ID * 10) + 2;

export const AUTHORS0: Author[] = [
    new Author({
        id: AUTHORS0_0_ID,
        active: true,
        firstName: "Fred",
        lastName: "Flintstone",
        libraryId: LIBRARY0_ID,
        notes: null,
    }),
    new Author({
        id: AUTHORS0_1_ID,
        active: true,
        firstName: "Wilma",
        lastName: "Flintstone",
        libraryId: LIBRARY0_ID,
        notes: null,
    }),
    new Author({
        id: AUTHORS0_2_ID,
        active: true,
        firstName: "Pebbles",
        lastName: "Flintstone",
        libraryId: LIBRARY0_ID,
        notes: null,
    }),
];

export const AUTHORS1_0_ID = (LIBRARY0_ID * 10) + 0;
export const AUTHORS1_1_ID = (LIBRARY0_ID * 10) + 1;
export const AUTHORS1_2_ID = (LIBRARY0_ID * 10) + 2;

export const AUTHORS1: Author[] = [
    new Author({
        id: AUTHORS1_0_ID,
        active: true,
        firstName: "Barney",
        lastName: "Rubble",
        libraryId: LIBRARY1_ID,
        notes: null,
    }),
    new Author({
        id: AUTHORS1_1_ID,
        active: true,
        firstName: "Betty",
        lastName: "Rubble",
        libraryId: LIBRARY1_ID,
        notes: null,
    }),
    new Author({
        id: AUTHORS1_2_ID,
        active: true,
        firstName: "Bam Bam",
        lastName: "Rubble",
        libraryId: LIBRARY1_ID,
        notes: null,
    }),
];

