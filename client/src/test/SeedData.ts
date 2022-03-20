// SeedData ------------------------------------------------------------------

// Mock data for the unit tests using mock service workers.

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from "../models/Library";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

// ----- Common Identifiers --------------------------------------------------

export const LIBRARY_ZERO_NAME = "Library 0";
export const LIBRARY_ONE_NAME = "Library 1";
export const LIBRARY_TWO_NAME = "Library 2";

export const LIBRARY_SCOPE = "test";

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

export const AUTHORS2: Author[] = [
    new Author({
        active: true,
        firstName: "George",
        lastName: "Jetson",
        notes: null,
    }),
    new Author({
        active: true,
        firstName: "Jane",
        lastName: "Jetson",
        notes: null,
    }),
    new Author({
        active: false,
        firstName: "Judy",
        lastName: "Jetson",
        notes: null,
    }),
    new Author({
        active: true,
        firstName: "Elroy",
        lastName: "Jetson",
        notes: null,
    }),
];

// ----- Libraries -----------------------------------------------------------

// Must populate id field.

export const LIBRARIES: Library[] = [
    new Library({
        active: true,
        name: LIBRARY_ZERO_NAME,
        notes: null,
        scope: "test",
    }),
    new Library({
        active: true,
        name: LIBRARY_ONE_NAME,
        notes: null,
        scope: "test",
    }),
    new Library({
        active: false,
        name: LIBRARY_TWO_NAME,
        notes: null,
        scope: "test",
    }),
];

// ----- Users ---------------------------------------------------------------

export const USER_SCOPE_ADMIN = `${LIBRARY_SCOPE}:admin`;
export const USER_SCOPE_REGULAR = `${LIBRARY_SCOPE}:regular`;
export const USER_SCOPE_SUPERUSER = `superuser`;

export const USER_USERNAME_ADMIN = "testadmin";
export const USER_USERNAME_REGULAR = "testregular";
export const USER_USERNAME_SUPERUSER = "testsuperuser";

// Must populate id field.

export const USERS: User[] = [
    new User({
        active: true,
        name: "Test Admin User",
        password: USER_USERNAME_ADMIN,
        scope: USER_SCOPE_ADMIN,
        username: USER_USERNAME_ADMIN,
    }),
    new User({
        active: true,
        name: "Test Regular User",
        password: USER_USERNAME_REGULAR,
        scope: USER_SCOPE_REGULAR,
        username: USER_USERNAME_REGULAR,
    }),
    new User({
        active: true,
        name: "Test Superuser User",
        password: USER_USERNAME_SUPERUSER,
        scope: USER_SCOPE_SUPERUSER,
        username: USER_USERNAME_SUPERUSER,
    }),
];

