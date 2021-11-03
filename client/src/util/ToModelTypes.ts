// ToModelTypes --------------------------------------------------------------

// Convert arbitrary objects or arrays to the corresonding Model instances.

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import Library from "../models/Library";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const ACCESS_TOKEN = (value: any): AccessToken => {
    return new AccessToken(value);
}

export const ACCESS_TOKENS = (values: any[]): AccessToken[] => {
    const results: AccessToken[] = [];
    values.forEach(value => {
        results.push(new AccessToken(value));
    });
    return results;
}

export const LIBRARY = (value: any): Library => {
    return new Library(value);
}

export const LIBRARIES = (values: any[]): Library[] => {
    const results: Library[] = [];
    values.forEach(value => {
        results.push(new Library(value));
    });
    return results;
}

export const REFRESH_TOKEN = (value: any): RefreshToken => {
    return new RefreshToken(value);
}

export const REFRESH_TOKENS = (values: any[]): RefreshToken[] => {
    const results: RefreshToken[] = [];
    values.forEach(value => {
        results.push(new RefreshToken(value));
    });
    return results;
}

export const USER = (value: any): User => {
    return new User(value);
}

export const USERS = (values: any[]): User[] => {
    const results: User[] = [];
    values.forEach(value => {
        results.push(new User(value));
    });
    return results;
}
