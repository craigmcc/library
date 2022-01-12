// MockLibraryServices -------------------------------------------------------

// Client side mocks for LibraryServices operations.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Library from "../models/Library";
import * as Sorters from "../util/Sorters";

// Private Objects -----------------------------------------------------------

let ids: number[] = [];                 // Library IDs by index from SeedData.
let lastId = 0;                         // Last used ID value
let map = new Map<number, Library>();   // Map of Libraries keyed by id

// Public Objects ------------------------------------------------------------

/**
 * Return a sorted array of all Libraries.
 */
export const all = (): Library[] => {
    const results: Library[] = [];
    for (const library of map.values()) {
        results.push(new Library(library));
    }
    return Sorters.LIBRARIES(results);
}

/**
 * Return the Library with the specified name, if any.
 */
export const exact = (name: string): Library | undefined => {
    let result: Library | undefined = undefined;
    for (const library of map.values()) {
        if (library.name === name) {
            result = new Library(library);
        }
    }
    return result;
}

/**
 * Return the Library with the specified id, if any.
 */
export const find = (libraryId: number): Library | undefined => {
    const result = map.get(libraryId);
    if (result) {
        return new Library(result);
    } else {
        return undefined;
    }
}

/**
 * Return the library ID at the specified index position from SeedData.
 */
export const id = (index: number): number => {
    return ids[index];
}

/**
 * Insert and return a new Library after assigning it a new ID.
 */
export const insert = (library: Library): Library => {
    const inserted = new Library({
        ...library,
        id: ++lastId,
    });
    map.set(inserted.id, inserted);
    return inserted;
}

/**
 * Reset the mock database to be empty.
 */
export const reset = (): void => {
    ids = [];
    lastId = 0;
    map.clear();
}

