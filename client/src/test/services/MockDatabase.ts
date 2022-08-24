// MockDatabase --------------------------------------------------------------

// Manage the overall set of mock database services for client side tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import * as MockAuthorServices from "./MockAuthorServices";
import MockLibraryServices from "./MockLibraryServices";
import MockUserServices from "./MockUserServices";
import * as SeedData from "../SeedData";
import Author from "../../models/Author";
import Library from "../../models/Library";
import User from "../../models/User";

// Public Functions ---------------------------------------------------------

/**
 * Reset database data and reload from SeedData.  Calling this ensures that
 * all tests start with exactly the same initial "database" contents.
 */
export const reset = (): void => {

    // Reset model collections
    MockAuthorServices.reset();
    MockLibraryServices.reset();
    MockUserServices.reset();

    // Load model data, with Users and Libraries first
    /*const users = */loadUsers(SeedData.USERS);
    const libraries = loadLibraries(SeedData.LIBRARIES);

    loadAuthors(libraries[0].id, SeedData.AUTHORS0);
    loadAuthors(libraries[1].id, SeedData.AUTHORS1);
    loadAuthors(libraries[2].id, SeedData.AUTHORS2);

}

// Private Methods -----------------------------------------------------------

const loadAuthors = (libraryId: number, authors: Author[]): Author[] => {
    const results: Author[] = [];
    authors.forEach(author => {
        results.push(MockAuthorServices.insert(libraryId, author));
    });
    return results;
}

const loadLibraries = (libraries: Library[]): Library[] => {
    const results: Library[] = [];
    libraries.forEach(library => {
        results.push(MockLibraryServices.insert(library));
    });
    return results;
}

const loadUsers = (users: User[]): User[] => {
    const results: User[] = [];
    users.forEach(user => {
        results.push(MockUserServices.insert(user));
    });
    return results;
}

