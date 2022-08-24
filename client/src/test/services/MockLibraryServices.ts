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
