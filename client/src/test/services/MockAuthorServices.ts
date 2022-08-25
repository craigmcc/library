// MockAuthorServices --------------------------------------------------------

// Client side mocks for AuthorServices operations.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import MockChildServices from "./MockChildServices";
import MockLibraryServices from "./MockLibraryServices";
import Author from "../../models/Author";
import {NotFound} from "../../util/HttpErrors";
import Library from "../../models/Library";

// Public Objects ------------------------------------------------------------

class MockAuthorServices extends MockChildServices<Author, Library> {

    constructor() {
        super(MockLibraryServices, Author);
    }

    // Model Specific Methods ------------------------------------------------

    /**
     * Return the Author with the specified names (if any), or throw NotFound.
     *
     * @param libraryId                 ID of the owning Library
     * @param firstName                 First name to be matched
     * @param lastName                  Last name to be matched
     * @param query                     Query parameters from HTTP request
     *
     * @throws NotFound                 If no Library with this name is found
     */
    public exact(libraryId: number, firstName: string, lastName: string, query?: URLSearchParams): Author {
        for (const result of this.map.values()) {
            if ((result.libraryId === libraryId) &&
                (result.firstName === firstName) &&
                (result.lastName === lastName)) {
                return this.includes(result, query);
            }
        }
        throw new NotFound(
            `name: Missing Author '${firstName} ${lastName}'`,
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
    public includes(model: Author, query?: URLSearchParams): Author {
        const result = new Author(model);
        if (query) {
            // TODO - implement withLibrary
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
    public matches(model: Author, query?: URLSearchParams): boolean {
        let result = true;
        if (query) {
            if (query.has("active") && !model.active) {
                result = false;
            }
            // TODO - implement "name" match
        }
        return result;
    }

}

export default new MockAuthorServices();
