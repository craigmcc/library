// MockAuthorServices --------------------------------------------------------

// Client side mocks for AuthorServices operations.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {NotFound} from "../HttpErrors";
import MockLibraryServices from "./MockLibraryServices";
import Author from "../../models/Author";
import * as Sorters from "../../util/Sorters";

// Private Objects -----------------------------------------------------------

let map = new Map<number, Author>();    // Map of Authors keyed by id
let nextId = 0;                         // Next used ID value

// Public Objects ------------------------------------------------------------

/**
 * Return a sorted array of all Authors for the specified Library.
 */
export const all = (libraryId: number, query: any): Author[] => {
    MockLibraryServices.find(libraryId);
    const results: Author[] = [];
    for (const author of map.values()) {
        if (author.libraryId === libraryId) {
            if (matches(author, query)) {
                results.push(includes(author, query));
            }
        }
    }
    return Sorters.AUTHORS(results);
}

/**
 * Return the Author with the specified name, for the specified Library, if any.
 */
export const exact = (libraryId: number, firstName: string, lastName: string, query?: any): Author => {
    MockLibraryServices.find(libraryId);
    let found: Author | undefined = undefined;
    for (const author of map.values()) {
        if ((author.libraryId === libraryId) &&
            (author.firstName === firstName) &&
            (author.lastName === lastName)) {
            found = author;
        }
    }
    if (found) {
        return includes(found, query);
    } else {
        throw new NotFound(
            `name: Missing Author '${firstName} ${lastName}'`,
            "MockAuthorServices.exact",
        );
    }
}

/**
 * Return the Author with the specified id, for the specified Library, if any.
 */
export const find = (libraryId: number, authorId: number, query: any): Author => {
    MockLibraryServices.find(libraryId);
    const found = map.get(authorId);
    if (found && (found.libraryId === libraryId)) {
        return includes(found, query);
    } else {
        throw new NotFound(
            `authorId: Missing Author ${authorId}`,
            "MockAuthorServices.find",
        );
    }
}

/**
 * Insert and return a new Author for the specified Library, after assigning it a new ID.
 */
export const insert = (libraryId: number, author: Author): Author => {
    MockLibraryServices.find(libraryId);
    // NOTE - Check for duplicate key violations?
    const inserted = new Author({
        ...author,
        id: nextId++,
        libraryId: libraryId,
    });
    map.set(inserted.id, inserted);
    return inserted;
}

/**
 * Remove and return an existing Author.
 */
export const remove = (libraryId: number, authorId: number): Author => {
    const removed = find(libraryId, authorId, {});
    map.delete(authorId);
    return removed;
}

/**
 * Reset the mock database to be empty.
 */
export const reset = (): void => {
    nextId = 2000;
    map.clear();
}

/**
 * Update and return an existing Author.
 */
export const update = (libraryId: number, authorId: number, author: Author): Author => {
    const original = find(libraryId, authorId, {});
    // NOTE - Check for duplicate key violations?
    const updated = {
        ...original,
        ...author,
        id: authorId,
        libraryId: libraryId,
    }
    map.set(authorId, updated);
    return new Author(updated);
}

// Private Functions ---------------------------------------------------------

/**
 * Return a new Author, decorated with parent and child objets based on
 * any specified "with" parameters.
 *
 * @param author                        Author to be decorated and returned
 * @param query                         Query parameters from this request
 */
const includes = (author: Author, query: any): Author => {
    const result = new Author(author);
    if (query) {
        if ("" === query.withLibrary) {
            result.library = MockLibraryServices.find(author.libraryId);
        }
        // NOTE - implement withSeries
        // NOTE - implement withStories
        // NOTE - implement withVolumes
    }
    return result;
}

/**
 * Return true if this Author matches all specified match criteria (if any).
 *
 * @param author                        Author to be tested
 * @param query                         Query parameters from this request
 */
const matches = (author: Author, query: any): boolean => {
    let result = true;
    if (query) {
        if (("" === query.active) && !author.active) {
            result = false;
        }
        // NOTE - implement name
    }
    return result;
}
