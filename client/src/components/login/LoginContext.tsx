// LoginContext --------------------------------------------------------------

// React Context containing information about the currently logged-in user,
// if there is one.  If there is not, the LOGIN_CONTEXT global variable will be
// null, and the loggedIn context method will return false.

// External Modules ----------------------------------------------------------

import React, {createContext} from "react";

// Internal Modules ----------------------------------------------------------

import {LOGIN_DATA_KEY, LOGIN_USER_KEY} from "../../constants";
import {LoginData, Scope} from "../../types";
import useLocalStorage from "../../hooks/useLocalStorage";
import Credentials from "../../models/Credentials";
import Library from "../../models/Library";
import User from "../../models/User";
import logger from "../../util/ClientLogger";
import {login, logout, refreshUser} from "../../util/LoginDataUtils";

// Context Properties -------------------------------------------------------

// Data that is visible to HTTP clients not part of the React component hierarchy
const LOGIN_DATA: LoginData = {
    accessToken: null,
    alloweds: null,
    expires: null,
    loggedIn: false,
    refreshToken: null,
    scope: null,
    username: null,
};

// Dummy initial values for User
const LOGIN_USER: User = new User({
    active: false,
    firstName: "-----",
    lastName: "-----",
});

// State (including data) visible to LoginContext consumers
export interface LoginState {
    data: LoginData;
    user: User;
    handleLogin: (credentials: Credentials) => void;
    handleLogout: () => void;
    validateLibrary: (library: Library, scope?: Scope) => boolean;
    validateScope: (scope: string) => boolean;
}

export const LoginContext = createContext<LoginState>({
    data: LOGIN_DATA,
    user: LOGIN_USER,
    handleLogin: (credentials: Credentials): void => {
        // Will be replaced in the real returned context information
    },
    handleLogout: (): void => {
        // Will be replaced in the real returned context information
    },
    validateLibrary: (library: Library): boolean => { return false },
    validateScope: (scope: string): boolean => { return false },
});

// Context Provider ----------------------------------------------------------

// Log level configuration
export const LOG_DEFAULT = "info";      // Default log level
export const LOG_PREFIX = "log:";       // Prefix for scope values defining log level

// @ts-ignore
export const LoginContextProvider = ({ children }) => {

    const [data, setData] = useLocalStorage<LoginData>(LOGIN_DATA_KEY, LOGIN_DATA);
    const [user, setUser] = useLocalStorage<User>(LOGIN_USER_KEY, LOGIN_USER);

    /**
     * Attempt a login and record the results.
     *
     * @param credentials               Login credentials to authenticate
     *
     * @throws OAuthError               If authentication fails
     */
    const handleLogin = async (credentials: Credentials): Promise<void> => {

        // Attempt to authenticate the specified credentials
        const newData = await login(credentials);
        setData(newData);
        setUser(await refreshUser(newData));

        // Save allowed scope(s) and set logging level
        let logLevel = LOG_DEFAULT;
        if (newData.alloweds) {
            newData.alloweds.forEach(allowed => {
                if (allowed.startsWith(LOG_PREFIX)) {
                    logLevel = allowed.substring(LOG_PREFIX.length);
                }
            })
        }
        // TODO - this is not saved across page reloads
        logger.setLevel(logLevel);

        // Document this login
        logger.info({
            context: "LoginContext.handleLogin",
            username: newData.username,
            scope: newData.scope,
            logLevel: logLevel,
        });

        // Refresh the current User information
        await refreshUser(newData);

    }

    /**
     * Handle a successful logout.
     */
    const handleLogout = async (): Promise<void> => {

        logger.info({
            context: "LoginContext.handleLogout",
            username: data.username,
        });

        // Reset logging to the default level
        logger.setLevel(LOG_DEFAULT);

        // Perform logout on the server
        const newData = await logout();
        setData(newData);
        setUser(await refreshUser(newData));

    }

    /**
     * Return true if the currently logged in User has specified scope
     * permissions on the specified Library.
     *
     * @param library                   Library to be tested for
     * @param scope                     Scope to be tested for [admin or regular]
     */
    const validateLibrary = (library: Library, scope?: Scope): boolean => {
        if (scope) {
            return validateScope(`${library.scope}:${scope}`);
        } else {
            return validateScope(`${library.scope}:${Scope.ADMIN}`)
                || validateScope(`${library.scope}:${Scope.REGULAR}`);
        }
    }

    /**
     * Return true if the currently logged-in User has the specified
     * scope permissions.
     *
     * @param scope                     Scope to be tested for
     */
    const validateScope = (scope: string): boolean => {

        // Users not logged in will never pass scope requirements
        if (!data.loggedIn) {
            return false;
        }

        // Special handling for superuser scope
        if (data.alloweds.includes(Scope.SUPERUSER)) {
            return true;
        }

        // Special handling for a logged in user with *any* scope
        if (scope === "") {
            return true;
        }

        // Otherwise, check required scope(s) versus allowed scope(s)
        const requireds = scope ? scope.split(" ") : [];
        if (requireds.length === 0) {
            return true;
        }
        let missing = false;
        requireds.forEach(required => {
            if (!data.alloweds.includes(required)) {
                missing = true;
            }
        });
        if (missing) {
            return false;
        }

        // The requested scope is allowed
        return true;

    }

    const loginContext: LoginState = {
        data: data,
        user: user,
        handleLogin: handleLogin,
        handleLogout: handleLogout,
        validateLibrary: validateLibrary,
        validateScope: validateScope,
    }

    return (
        <LoginContext.Provider value={loginContext}>
            {children}
        </LoginContext.Provider>
    )

}

export default LoginContext;
