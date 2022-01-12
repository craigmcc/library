// MockAuthorServices --------------------------------------------------------

// Client side mocks for AuthorServices operations.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import * as Sorters from "../util/Sorters";

// Private Objects -----------------------------------------------------------

let lastId = 0;                         // Last used ID value
let map = new Map<number, Author>();    // Map of Authors keyed by id

// Public Objects ------------------------------------------------------------

/**
 * Return a sorted array of all Authors for the specified Library.
 */
export const all = (libraryId: number): Author[] => {
    const results: Author[] = [];
    for (const author of map.values()) {
        if (author.libraryId === libraryId) {
            results.push(new Author(author));
        }
    }
    return Sorters.AUTHORS(results);
}

/**
 * Return the Author with the specified name, for the specified Library, if any.
 */
export const exact = (libraryId: number, firstName: string, lastName: string): Author | undefined => {
    let result: Author | undefined = undefined;
    for (const author of map.values()) {
        if ((author.libraryId === libraryId) &&
            (author.firstName === firstName) &&
            (author.lastName === lastName)) {
            result = new Author(author);
        }
    }
    return result;
}

/**
 * Return the Author with the specified id, for the specified Library, if any.
 */
export const find = (libraryId: number, authorId: number): Author | undefined => {
    const result = map.get(authorId);
    if (result && (result.libraryId === libraryId)) {
        return new Author(result);
    } else {
        return undefined;
    }
}

/**
 * Insert and return a new Author for the specified Library, after assigning it a new ID.
 */
export const insert = (libraryId: number, author: Author): Author => {
    const inserted = new Author({
        ...author,
        id: ++lastId,
        libraryId: libraryId,
    });
    map.set(inserted.id, inserted);
    return inserted;
}

/**
 * Reset the mock database to be empty.
 */
export const reset = (): void => {
    lastId = 0;
    map.clear();
}

