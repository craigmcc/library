// MockLibraryServices -------------------------------------------------------

// Client side mocks for LibraryServices operations.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {NotFound} from "./HttpErrors";
import Library from "../models/Library";
import * as Sorters from "../util/Sorters";

// Private Objects -----------------------------------------------------------

let ids: number[] = [];                 // Library IDs by index from SeedData.
let map = new Map<number, Library>();   // Map of Libraries keyed by id
let nextId = 0;                         // Next used ID value

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
export const exact = (name: string): Library => {
    let result: Library | undefined = undefined;
    for (const library of map.values()) {
        if (library.name === name) {
            result = library;
        }
    }
    if (result) {
        return new Library(result);
    } else {
        throw new NotFound(
            `name: Missing Library '${name}`,
            "MockLibraryServices.exact",
        );
    }
}

/**
 * Return the Library with the specified id, if any.
 */
export const find = (libraryId: number): Library => {
    const result = map.get(libraryId);
    if (result) {
        return new Library(result);
    } else {
        throw new NotFound(
            `libraryId: Missing Library ${libraryId}`,
            "MockLibraryServices.find",
        );
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
    // NOTE - Check for duplicate key violation?
    const inserted = new Library({
        ...library,
        id: nextId++,
    });
    ids.push(inserted.id);
    map.set(inserted.id, inserted);
    return inserted;
}

/**
 * Reset the mock database to be empty.
 */
export const reset = (): void => {
    ids = [];
    nextId = 1000;
    map.clear();
}

