// MockUserServices ----------------------------------------------------------

// Client side mocks for UserServices operations.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import MockParentServices from "./MockParentServices";
import User from "../../models/User";
import {NotFound} from "../../util/HttpErrors";

// Public Objects ------------------------------------------------------------

class MockUserServices extends MockParentServices<User> {

    constructor() {
        super(User);
    }

    // Model Specific Methods ------------------------------------------------

    /**
     * Return the User with the specified username (if any), or throw NotFound.
     *
     * @param username                  Username to be matched
     * @param query                     Query parameters from HTTP request
     *
     * @throws NotFound                 If no User with this name is found
     */
    public exact(username: string, query?: URLSearchParams): User {
        for (const result of this.map.values()) {
            if (result.username === username) {
                return this.includes(result, query);
            }
        }
        throw new NotFound(
            `name Missing User '${username}'`,
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
    public includes(model: User, query?: URLSearchParams): User {
        const result = new User(model);
        if (query) {
            // TODO - implement withAccessTokens
            // TODO - implement withRefreshTokens
        }
        return model;
    }

    /**
     * Return true if this model matches criteria in the specified query.
     *
     * @param model                     Model instance to be checked
     * @param query                     Query parameters from HTTP request
     */
    public matches(model: User, query?: URLSearchParams): boolean {
        let result = true;
        if (query) {
            if (query.has("active") && !model.active) {
                result = false;
            }
            // TODO - implement "username" match
        }
        return result;
    }

}

export default new MockUserServices();
