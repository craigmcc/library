// sort-orders ---------------------------------------------------------------

// Standard "order" options for sorting returned results.

// External Modules ----------------------------------------------------------

import { Order } from "sequelize";

// Public Objects ------------------------------------------------------------

export const AUTHOR_ORDER: Order = [
    [ "libraryId", "ASC" ],
    [ "lastName", "ASC" ],
    [ "firstName", "ASC" ],
];

export const LIBRARY_ORDER: Order = [
    [ "name", "ASC" ],
];

export const USER_ORDER: Order = [
    [ "libraryId", "ASC" ],
    [ "username", "ASC" ],
];
