// MockLibraryServices -------------------------------------------------------

// Client side mocks for LibraryServices operations.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

//import * as MockAuthorServices from "./MockAuthorServices";
import MockParentServices from "./MockParentServices";
import Library from "../../models/Library";
import {NotFound} from "../../util/HttpErrors";

// Public Objects ------------------------------------------------------------

class MockLibraryServices extends MockParentServices<Library> {

    constructor() {
        super(Library);
    }

    // Model Specific Methods ------------------------------------------------

    /**
     * Return the Library with the specified name (if any), or throw NotFound.
     *
     * @param name                      Name to be matched
     * @param query                     Query parameters from HTTP request
     *
     * @throws NotFound                 If no Library with this name is found
     */
    public exact(name: string, query?: URLSearchParams): Library {
        for (const result of this.map.values()) {
            if (result.name === name) {
                return this.includes(result, query);
            }
        }
        throw new NotFound(
            `name Missing Library '${name}'`,
            `${this.name}Services.exact`,
        );
    }

    // Concrete Helper Methods -----------------------------------------------

    /**
     * Return this model, with extra fields for any specified child models
     * based on the query parameters.
     *
     * @param model                     Model instance to be decorated
     * @param query                     Query parameters from HTTP request
     */
    public includes(model: Library, query?: URLSearchParams): Library {
        const result = new Library(model);
        if (query) {
            // TODO - implement withAuthors
            // TODO - implement withSeries
            // TODO - implement withStories
            // TODO - implement withVolumes
        }
        return model;
    }

    /**
     * Return true if this model matches criteria in the specified query.
     *
     * @param model                     Model instance to be checked
     * @param query                     Query parameters from HTTP request
     */
    public matches(model: Library, query?: URLSearchParams): boolean {
        let result = true;
        if (query) {
            if (query.has("active") && !model.active) {
                result = false;
            }
            // TODO - implement "name" match
            if (query.has("scope") && (query.get("scope") !== model.scope)) {
                result = false;
            }
        }
        return result;
    }

}

export default new MockLibraryServices();





// Private Objects -----------------------------------------------------------

let ids: number[] = [];                 // Library IDs by index from SeedData.
let map = new Map<number, Library>();   // Map of Libraries keyed by id
let nextId = 0;                         // Next used ID value

// Public Objects ------------------------------------------------------------

/**
 * Return a sorted array of all matching Libraries.
 */
export const all = (query: any): Library[] => {
    const results: Library[] = [];
    for (const library of map.values()) {
        if (matches(library, query)) {
            results.push(includes(library, query));
        }
    }
    return /* Sorters.LIBRARIES(*/results/*)*/;
}

/**
 * Return the Library with the specified name, if any.
 */
export const exact = (name: string, query?: any): Library => {
    let found: Library | undefined = undefined;
    for (const library of map.values()) {
        if (library.name === name) {
            found = library;
        }
    }
    if (found) {
        return includes(found, query);
    } else {
        throw new NotFound(
            `name: Missing Library '${name}'`,
            "MockLibraryServices.exact",
        );
    }
}

/**
 * Return the Library with the specified id, if any.
 */
export const find = (libraryId: number, query: any): Library => {
    const found = map.get(libraryId);
    if (found) {
        return includes(found, query);
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
    // NOTE - Check for duplicate key violations?
    const inserted = new Library({
        ...library,
        id: nextId++,
    });
    ids.push(inserted.id);
    map.set(inserted.id, inserted);
    return inserted;
}

/**
 * Remove and return an existing Library.
 */
export const remove = (libraryId: number): Library => {
    const removed = find(libraryId, {});
    map.delete(libraryId);
    return removed;
}

/**
 * Reset the mock database to be empty.
 */
export const reset = (): void => {
    ids = [];
    nextId = 1000;
    map.clear();
}

/**
 * Update and return an existing Library.
 */
export const update = (libraryId: number, library: Library): Library => {
    const original = find(libraryId, {});
    // NOTE - Check for duplicate key violations?
    const updated = {
        ...original,
        ...library,
        id: libraryId,
    }
    map.set(libraryId, updated);
    return new Library(updated);
}

// Private Functions ---------------------------------------------------------

/**
 * Return a new Library, decorated with child objects based on
 * any specified "with" parameters.
 *
 * @param library                       Library to be decorated and returned
 * @param query                         Query parameters from this request
 */
const includes = (library: Library, query: any): Library => {
    const result = new Library(library);
    if (query) {
/*
        if ("" === query.withAuthors) {
            result.authors = MockAuthorServices.all(library.id, {});
        }
*/
        // NOTE - implement withSeries
        // NOTE - implement withStories
        // NOTE - implement withVolumes
    }
    return result;
}

/**
 * Return true if this Library matches all specified match criteria (if any).
 *
 * @param library                       Library to be tested
 * @param query                         Query parameters from this request
 */
const matches = (library: Library, query: any): boolean => {
    let result = true;
    if (query) {
        if (("" === query.active) && !library.active) {
            result = false;
        }
        // NOTE - implement name
        if (query.scope && (query.scope !== library.scope)) {
            result = false;
        }
    }
    return result;
}

