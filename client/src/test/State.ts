// State ---------------------------------------------------------------------

// Utility functions to return preconfigured state values for various
// React Context implementations.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {LoginData} from "../types";
import {State as LibraryContextState} from "../components/libraries/LibraryContext";
import {LoginState as LoginContextState} from "../components/login/LoginContext";
import Library from "../models/Library";
import User from "../models/User";
import MockLibraryServices from "./services/MockLibraryServices";
import LocalStorage from "../util/LocalStorage";
import {LOGIN_DATA_KEY} from "../constants";

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
        libraries: (user) ? MockLibraryServices.all() : [],
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
    const loginDataData: LoginData = {
        accessToken: (user) ? "accesstoken" : null,
        alloweds: (user) ? user.scope.split(" ") : null,
        expires: (user) ? new Date() : null,
        loggedIn: (user) ? true : false,
        refreshToken: (user) ? "refreshtoken" : null,
        scope: (user) ? user.scope : null,
        username: (user) ? user.username : null,
    }
    const loginData = new LocalStorage(LOGIN_DATA_KEY, loginDataData);
    return {
        data: loginDataData,
        user: user ? user : new User(),
        handleLogin: jest.fn(),
        handleLogout: jest.fn(),
        validateLibrary: jest.fn(),
        validateScope: jest.fn(),
    }
}

