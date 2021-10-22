// SeedData ------------------------------------------------------------------

// Seed data for tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
// import Author from "../models/Author";
import Library from "../models/Library";
import RefreshToken from "../models/RefreshToken";
// import Series from "../models/Series";
// import Story from "../models/Story";
import User from "../models/User";
import Volume from "../models/Volume";

// Seed Data -----------------------------------------------------------------

// ***** Libraries *****

export const LIBRARY_NAME_FIRST = "Test Library";
export const LIBRARY_NAME_SECOND = "Extra Library";
export const LIBRARY_SCOPE_FIRST = "scope1";
export const LIBRARY_SCOPE_SECOND = "scope2";

// NOTE: Tests never touch any libraries except these!!!
export const LIBRARIES: Partial<Library>[] = [
    {
        name: LIBRARY_NAME_FIRST,
        scope: LIBRARY_SCOPE_FIRST,
    },
    {
        name: LIBRARY_NAME_SECOND,
        scope: LIBRARY_SCOPE_SECOND,
    },
];

// *** Access Tokens ***

const ONE_DAY = 24 * 60 * 60 * 1000;    // One day (milliseconds)

export const ACCESS_TOKENS_SUPERUSER: Partial<AccessToken>[] = [
    {
        expires: new Date(new Date().getTime() + ONE_DAY),
        scope: "superuser",
        token: "superuser_access_1",
        // userId must be seeded
    },
    {
        expires: new Date(new Date().getTime() - ONE_DAY),
        scope: "superuser",
        token: "superuser_access_2",
        // userId must be seeded
    },
];

// ***** Authors *****

/*
// For FIRST_LIBRARY (libraryId to be interpolated)
export const AUTHORS_LIBRARY0: Partial<Author>[] = [
    {
        firstName: "Fred",
        lastName: "Flintstone",
    },
    {
        firstName: "Wilma",
        lastName: "Flintstone",
    },
];

// For SECOND_LIBRARY (libraryId to be interpolated)
export const AUTHORS_LIBRARY1: Partial<Author>[] = [
    {
        firstName: "Barney",
        lastName: "Rubble",
    },
    {
        firstName: "Betty",
        lastName: "Rubble",
    },
];
*/

// *** Refresh Tokens ***

export const REFRESH_TOKENS_SUPERUSER: Partial<RefreshToken>[] = [
    {
        accessToken: "superuser_access_1",
        expires: new Date(new Date().getTime() + ONE_DAY),
        token: "superuser_refresh_1",
        // userId must be seeded
    },
    {
        accessToken: "superuser_access_2",
        expires: new Date(new Date().getTime() - ONE_DAY),
        token: "superuser_refresh_2",
        // userId must be seeded
    },
];

// ***** Series *****

/*
export const SERIES_LIBRARY0: Partial<Series>[] = [
    {
        name: "Flintstone Series",
    },
]

export const SERIES_LIBRARY1: Partial<Series>[] = [
    {
        name: "Rubble Series",
    },
]
*/

// ***** Stories *****

/*
// For FIRST_LIBRARY (libraryId to be interpolated)
export const STORIES_LIBRARY0: Partial<Story>[] = [
    {
        "name": "Fred Story",
    },
    {
        "name": "Wilma Story",
    },
    {
        "name": "Flintstone Story",
    }
];
*/

/*
// For SECOND_LIBRARY (libraryId to be interpolated)
export const STORIES_LIBRARY1: Partial<Story>[] = [
    {
        "name": "Barney Story",
    },
    {
        "name": "Betty Story",
    },
    {
        "name": "Rubble Story",
    }
];
*/

// ***** Users *****

export const USER_USERNAME_SUPERUSER = "superuser";
export const USER_USERNAME_FIRST_ADMIN = "firstadmin";
export const USER_USERNAME_FIRST_REGULAR = "firstregular";
export const USER_USERNAME_SECOND_ADMIN = "secondadmin";
export const USER_USERNAME_SECOND_REGULAR = "secondregular";

export const USERS: Partial<User>[] = [
    {
        active: true,
        name: "First Admin User",
        scope: "first:admin",
        username: USER_USERNAME_FIRST_ADMIN,
    },
    {
        active: true,
        name: "First Regular User",
        scope: "first:regular",
        username: USER_USERNAME_FIRST_REGULAR,
    },
    {
        active: false,
        name: "Second Admin User",
        scope: "second:admin",
        username: USER_USERNAME_SECOND_ADMIN,
    },
    {
        active: false,
        name: "Second Regular User",
        scope: "second:regular",
        username: USER_USERNAME_SECOND_REGULAR,
    },
    {
        active: true,
        name: "Superuser User",
        scope: "superuser",
        username: USER_USERNAME_SUPERUSER,
    }
];

// ***** Volumes *****

// For FIRST_LIBRARY (libraryId to be interpolated)
export const VOLUMES_LIBRARY0: Partial<Volume>[] = [
    {
        active: false,
        "googleId": "111",
        "isbn": "aaa",
        "location": "Box",
        "name": "Fred Volume",
        "type": "Anthology",
    },
    {
        "googleId": "222",
        "isbn": "222",
        "location": "Computer",
        "name": "Wilma Volume",
        "type": "Collection",
    },
    {
        "googleId": "333",
        "isbn": "ccc",
        "location": "Kindle",
        "name": "Flintstone Volume",
        "type": "Single",
    }
];

// For SECOND_LIBRARY (libraryId to be interpolated)
export const VOLUMES_LIBRARY1: Partial<Volume>[] = [
    {
        "googleId": "444",
        "isbn": "ddd",
        "location": "Kobo",
        "name": "Barney Volume",
        "type": "Anthology",
    },
    {
        active: false,
        "googleId": "555",
        "isbn": "eee",
        "location": "Other",
        "name": "Betty Volume",
        "type": "Collection",
    },
    {
        "googleId": "666",
        "isbn": "fff",
        "location": "Returned",
        "name": "Rubble Volume",
        "type": "Single",
    }
];
