// ToModelTypes --------------------------------------------------------------

// Convert arbitrary objects or arrays to the corresonding Model instances.

// Internal Modules ----------------------------------------------------------

import {Parent} from "../types";
import AccessToken from "../models/AccessToken";
import Author from "../models/Author";
import Library from "../models/Library";
import RefreshToken from "../models/RefreshToken";
import Series from "../models/Series";
import Story from "../models/Story";
import User from "../models/User";
import Volume from "../models/Volume";

// Public Objects ------------------------------------------------------------

export const ACCESS_TOKEN = (value: any): AccessToken => {
    return new AccessToken(value);
}

export const ACCESS_TOKENS = (values: any[]): AccessToken[] => {
    const results: AccessToken[] = [];
    values.forEach(value => {
        results.push(ACCESS_TOKEN(value));
    });
    return results;
}

export const AUTHOR = (value: any): Author => {
    return new Author(value);
}

export const AUTHORS = (values: any[]): Author[] => {
    const results: Author[] = [];
    values.forEach(value => {
        results.push(AUTHOR(value));
    });
    return results;
}

export const LIBRARY = (value: any): Library => {
    return new Library(value);
}

export const LIBRARIES = (values: any[]): Library[] => {
    const results: Library[] = [];
    values.forEach(value => {
        results.push(LIBRARY(value));
    });
    return results;
}

/**
 * Convert based on _type if present
 */
export const PARENT = (value: any): Parent => {
    if (value._model === "Author") {
        return new Author(value);
    } else if (value._model === "Library") {
        return new Library(value);
    } else if (value._model === "Series") {
        return new Series(value);
    } else if (value._model === "Story") {
        return new Story(value);
    } else if (value._model === "Volume") {
        return new Volume(value);
    } else {
        return value;
    }
}

export const REFRESH_TOKEN = (value: any): RefreshToken => {
    return new RefreshToken(value);
}

export const REFRESH_TOKENS = (values: any[]): RefreshToken[] => {
    const results: RefreshToken[] = [];
    values.forEach(value => {
        results.push(REFRESH_TOKEN(value));
    });
    return results;
}

export const SERIES = (value: any): Series => {
    return new Series(value);
}

export const SERIESES = (values: any[]): Series[] => {
    const results: Series[] = [];
    values.forEach(value => {
        results.push(SERIES(value));
    });
    return results;
}

export const STORY = (value: any): Story => {
    return new Story(value);
}

export const STORIES = (values: any[]): Story[] => {
    const results: Story[] = [];
    values.forEach(value => {
        results.push(STORY(value));
    });
    return results;
}

export const USER = (value: any): User => {
    return new User(value);
}

export const USERS = (values: any[]): User[] => {
    const results: User[] = [];
    values.forEach(value => {
        results.push(USER(value));
    });
    return results;
}

export const VOLUME = (value: any): Volume => {
    return new Volume(value);
}

export const VOLUMES = (values: any[]): Volume[] => {
    const results: Volume[] = [];
    values.forEach(value => {
        results.push(VOLUME(value));
    });
    return results;
}
