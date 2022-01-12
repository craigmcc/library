// MockDatabase --------------------------------------------------------------

// Manage the overall set of mock database services for client side tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import * as MockAuthorServices from "./MockAuthorServices";
import * as MockLibraryServices from "./MockLibraryServices";
import * as SeedData from "./SeedData";
import Author from "../models/Author";
import Library from "../models/Library";

// Public Functions ---------------------------------------------------------

/**
 * Reset database data and reload from SeedData.  Calling this ensures that
 * all tests start with exactly the same initial "database" contents.
 */
export const reset = (): void => {

    // Reset model collections
    MockAuthorServices.reset();
    MockLibraryServices.reset();

    // Load model data, with Libraries first
    loadLibraries(SeedData.LIBRARIES);
    loadAuthors(MockLibraryServices.id(0), SeedData.AUTHORS0);
    loadAuthors(MockLibraryServices.id(1), SeedData.AUTHORS1);

}

// Private Methods -----------------------------------------------------------

const loadAuthors = (libraryId: number, authors: Author[]): void => {
    authors.forEach(author => {
        MockAuthorServices.insert(libraryId, author);
    });
}

const loadLibraries = (libraries: Library[]): void => {
    libraries.forEach(library => {
        MockLibraryServices.insert(library);
    });
}

