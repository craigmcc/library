// Sorters -------------------------------------------------------------------

// Utility functions to sort arrays of objects into the preferred order.

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from "../models/Library";
import Series from "../models/Series";
import Story from "../models/Story";
import User from "../models/User";
import Volume from "../models/Volume";

// Public Objects ------------------------------------------------------------

export const AUTHORS = (authors: Author[]): Author[] => {
    return authors.sort(function (a, b) {
        if (a.libraryId > b.libraryId) {
            return 1;
        } else if (a.libraryId < b.libraryId) {
            return -1;
        } else if (a.lastName > b.lastName) {
            return 1;
        } else if (a.lastName < b.lastName) {
            return -1;
        } else if (a.firstName > b.firstName) {
            return 1;
        } else if (a.firstName < b.firstName) {
            return -1;
        } else {
            return 0;
        }
    });
}

export const LIBRARIES = (libraries: Library[]): Library[] => {
    return libraries.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        } else {
            return 0;
        }
    });
}

export const SERIESES = (serieses: Series[]): Series[] => {
    return serieses.sort(function (a, b) {
        if (a.libraryId > b.libraryId) {
            return 1;
        } else if (a.libraryId < b.libraryId) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        } else {
            return 0;
        }
    });
}

export const STORIES = (stories: Story[]): Story[] => {
    return stories.sort(function (a, b) {
        if (a.libraryId > b.libraryId) {
            return 1;
        } else if (a.libraryId < b.libraryId) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        } else {
            return 0;
        }
    });
}

export const USERS = (users: User[]): User[] => {
    return users.sort(function (a, b) {
        if (a.username > b.username) {
            return 1;
        } else if (a.username < b.username) {
            return -1;
        } else {
            return 0;
        }
    });
}

export const VOLUMES = (volumes: Volume[]): Volume[] => {
    return volumes.sort(function (a, b) {
        if (a.libraryId > b.libraryId) {
            return 1;
        } else if (a.libraryId < b.libraryId) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        } else {
            return 0;
        }
    });
}
