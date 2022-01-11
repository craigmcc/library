// MockDatabase --------------------------------------------------------------

// Mock "database" (and associated operations) for client side tests.

// NOTE: Methods that return matching data always return shallow copies of the
// actual "database" contents, so tests cannot accidentally corrupt the real
// "database" values.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import * as SeedData from "./SeedData";
import Author from "../models/Author";
import Library from "../models/Library";
import * as Sorters from "../util/Sorters";

// Database Data -------------------------------------------------------------

// Maps of objects by model type, keyed by id
const authorsMap = new Map<number, Author>();
const librariesMap = new Map<number, Library>();

// Last ID values by model type
let authorsId = 0;
let librariesId = 0;

// Library ids by index order in SeedData.LIBRARIES (useful in finding
// data associated with the corresponding Library data.
let libraryIds: number[] = [];

// Public Functions ---------------------------------------------------------

// ----- Global Functions -----

/**
 * Reset database data and reload from SeedData.  Calling this ensures that
 * all tests start with exactly the same initial "database" contents.
 */
export const reset = (): void => {

    // Reset object maps
    authorsMap.clear();
    librariesMap.clear();

    // Reset last ID values
    authorsId = 0;
    librariesId = 0;

    // Load main tables, with Libraries first
    loadLibraries(SeedData.LIBRARIES);
    loadAuthors(libraryIds[0], SeedData.AUTHORS0);
    loadAuthors(libraryIds[1], SeedData.AUTHORS1);

}

// ----- Authors -----

/**
 * Return a sorted array of all Authors for the specified Library.
 */
export const authorsAll = (library: Library): Author[] => {
    const results: Author[] = [];
    for (let author of authorsMap.values()) {
        if (author.libraryId === library.id) {
            results.push(new Author(author));
        }
    }
    return Sorters.AUTHORS(results);
}

/**
 * Return the Author with the specified name, if any.
 */
export const authorsExact = (libraryId: number, firstName: string, lastName: string): Author | undefined => {
    let result: Author | undefined = undefined;
    for (let author of authorsMap.values()) {
        if ((author.libraryId === libraryId) &&
            (author.firstName === firstName) &&
            (author.lastName === lastName)) {
            result = new Author(author);
        }
    }
    return result;
}

/**
 * Return the Author with the specified id, if any.
 */
export const authorsFind = (libraryId: number, authorId: number): Author | undefined => {
    const author = authorsMap.get(authorId);
    if (author && (author.libraryId === libraryId)) {
        return new Author(author);
    } else {
        return undefined;
    }
}

// ----- Libraries -----

/**
 * Return a sorted array of all Libraries.
 */
export const librariesAll = (): Library[] => {
    const results: Library[] = [];
    for (let library of librariesMap.values()) {
        results.push({ ...library });
    }
    return Sorters.LIBRARIES(results);
}

/**
 * Return the Library with the specified name, if any.
 */
export const librariesExact = (name: string): Library | undefined => {
    let result: Library | undefined = undefined;
    for (let library of librariesMap.values()) {
        if (library.name === name) {
            result = new Library(library);
        }
    }
    return result;
}

/**
 * Return the Library with the specified id, if any.
 */
export const librariesFind = (libraryId: number): Library | undefined => {
    const result = librariesMap.get(libraryId);
    if (result) {
        return new Library(result);
    } else {
        return undefined;
    }
}

/**
 * Return the library ID at the specified index position from SeedData.
 */
export const libraryId = (index: number): number => {
    return libraryIds[index];
}

// Private Methods -----------------------------------------------------------

const loadAuthors = (libraryId: number, authors: Author[]): void => {
    authors.forEach(data => {
        const author = new Author({
            ...data,
            id: ++authorsId,
            libraryId: libraryId,
        });
    });
}

const loadLibraries = (libraries: Library[]): void => {
    libraryIds = [];
    libraries.forEach(data => {
        const library = new Library({
            ...data,
            id: ++librariesId,
        });
        librariesMap.set(library.id, library);
        libraryIds.push(library.id);
    });
}

