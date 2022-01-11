// SeedData ------------------------------------------------------------------

// Mock data for the unit tests using mock service workers.

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from "../models/Library";

// Public Objects ------------------------------------------------------------

// ----- Authors -------------------------------------------------------------

// Must populate id and libraryId fields.

export const AUTHORS0: Author[] = [
    new Author({
        active: true,
        firstName: "Fred",
        lastName: "Flintstone",
        notes: null,
    }),
    new Author({
        active: true,
        firstName: "Wilma",
        lastName: "Flintstone",
        notes: null,
    }),
    new Author({
        active: true,
        firstName: "Pebbles",
        lastName: "Flintstone",
        notes: null,
    }),
];

export const AUTHORS1: Author[] = [
    new Author({
        active: true,
        firstName: "Barney",
        lastName: "Rubble",
        notes: null,
    }),
    new Author({
        active: true,
        firstName: "Betty",
        lastName: "Rubble",
        notes: null,
    }),
    new Author({
        active: true,
        firstName: "Bam Bam",
        lastName: "Rubble",
        notes: null,
    }),
];

// ----- Libraries -----------------------------------------------------------

// Must populate id field.

export const LIBRARIES: Library[] = [
    new Library({
        active: true,
        name: "Library Zero",
        notes: null,
        scope: "zero",
    }),
    new Library({
        active: true,
        name: "Library One",
        notes: null,
        scope: "one",
    }),
    new Library({
        active: true,
        name: "Library Two",
        notes: null,
        scope: "two",
    }),
];

