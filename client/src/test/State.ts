// State ---------------------------------------------------------------------

// Utility functions to return preconfigured state values for various
// React Context implementations.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {State as LibraryContextState} from "../components/libraries/LibraryContext";
import {LoginState as LoginContextState} from "../components/login/LoginContext";
import Library from "../models/Library";
import User from "../models/User";
import * as MockLibraryServices from "../test/MockLibraryServices";

// Public Objects ------------------------------------------------------------

/**
 * Return a preconfigured State value for a LibraryContext, based on whether
 * the specified User (if any) is considered logged in or not.
 *
 * @param user                          Logged in User [not logged in]
 * @param library                       Selected Library [none selected]
 */
export const libraryContext = (user: User | null, library: Library | null): LibraryContextState => {
    return {
        libraries: (user) ? MockLibraryServices.all({}) : [],
        library: (library) ? library : new Library(),
        handleRefresh: jest.fn(),
        handleSelect: jest.fn(),
    }
}

/**
 * Return a preconfigured State value for a LoginContext, based on whether
 * the specified User (if any) is to be considered logged in or not.
 *
 * @param user                          User to be logged in [not logged in]
 */
export const loginContext = (user: User | null): LoginContextState => {
    return {
        data: {
            accessToken: (user) ? "accesstoken" : null,
            expires: (user) ? new Date() : null,
            loggedIn: (user) ? true : false,
            refreshToken: (user) ? "refreshtoken" : null,
            scope: (user) ? user.scope : null,
            username: (user) ? user.username : null,
        },
        user: user ? user : new User(),
        handleLogin: jest.fn(),
        handleLogout: jest.fn(),
        validateLibrary: jest.fn(),
        validateScope: jest.fn(),
    }
}

