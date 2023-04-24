// util/Abridgers.ts

/**
 * Functions that return an abridged version of model objects,
 * for use in log events.
 *
 * @packageDocumentation
 */

// Internal Modules ----------------------------------------------------------

import {
    Library,
    User,
} from "../models";

// Public Objects ------------------------------------------------------------

/* TODO: Do Models need to be classes instead of interfaces?
export const ANY = (model: Library | User): object => {
    if (model instanceof Library) {
        return LIBRARY(model);
    } else if (model instanceof User) {
        return USER(model);
    } else {
        return model;
    }
}
*/

/**
 * Return an abridged Library object.
 *
 * @param library Unabridged library object
 */
export const LIBRARY = (library: Library): Partial<Library> => {
    return {
        id: library.id,
        name: library.name,
        //_model: library._model,
    }
}

/**
 * Return an array of abridged Library objects.
 *
 * @param libraries Array of unabridged Library objects.
 */
export const LIBRARIES = (libraries: Library[]): Partial<Library>[] => {
    const results: Partial<Library>[] = [];
    libraries.forEach(library => {
        results.push(LIBRARY(library));
    });
    return results;
}

/**
 * Return an abridged User object.
 *
 * @param user Unabridged User object
 */
export const USER = (user: User): Partial<User> => {
    return {
        id: user.id,
        scope: user.scope,
        username: user.username,
    }
}

/**
 * Return an array of abridged User objects.
 *
 * @param users Array of unabridged User objects
 */
export const USERS = (users: User[]): Partial<User>[] => {
    const results: Partial<User>[] = [];
    users.forEach(user => {
        results.push(USER(user));
    });
    return results;
}

