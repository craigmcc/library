// SeedData ------------------------------------------------------------------

// Mock data for the unit tests using mock service workers.

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from "../models/Library";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

// ----- Common Identifiers --------------------------------------------------

export const LIBRARY_ZERO = "Library Zero";
export const LIBRARY_ONE = "Library One";
export const LIBRARY_TWO = "Library Two";
export const USER_ADMIN = "testadmin";
export const USER_REGULAR = "testregular";

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
        name: LIBRARY_ZERO,
        notes: null,
        scope: "test",
    }),
    new Library({
        active: true,
        name: LIBRARY_ONE,
        notes: null,
        scope: "test",
    }),
    new Library({
        active: false,
        name: LIBRARY_TWO,
        notes: null,
        scope: "test",
    }),
];

// ----- Users ---------------------------------------------------------------

// Must populate id field.

export const USERS: User[] = [
    new User({
        active: true,
        name: "Test Admin User",
        password: USER_ADMIN,
        scope: "test:admin",
        username: USER_ADMIN,
    }),
    new User({
        active: true,
        name: "Test Regular User",
        password: USER_REGULAR,
        scope: "test:regular",
        username: USER_REGULAR,
    }),
/*
    new User({
        active: true,
        name: "Test Superuser User",
        password: "testsuper",
        scope: "superuser",
        username: "testsuper",
    }),
*/
];

