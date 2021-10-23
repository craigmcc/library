// SortOrder -----------------------------------------------------------------

// Standard "order" values for each defined Model

// External Modules ----------------------------------------------------------

import {Order} from "sequelize";

// Public Objects ------------------------------------------------------------

export const ACCESS_TOKENS: Order = [
    [ "userId", "ASC" ],
    [ "expires", "DESC" ],
];

export const AUTHORS: Order  = [
    [ "libraryId", "ASC" ],
    [ "lastName", "ASC" ],
    [ "firstName", "ASC" ],
];

export const LIBRARIES: Order = [
    [ "name", "ASC" ],
];

export const REFRESH_TOKENS: Order = [
    [ "userId", "ASC" ],
    [ "expires", "DESC" ],
];

export const SERIES: Order = [
    [ "libraryId", "ASC" ],
    [ "name", "ASC" ],
];

export const STORIES: Order = [
    [ "libraryId", "ASC" ],
    [ "name", "ASC" ],
];

export const USERS: Order = [
    [ "username", "ASC" ],
];

export const VOLUMES: Order = [
    [ "libraryId", "ASC" ],
    [ "name", "ASC" ],
];
