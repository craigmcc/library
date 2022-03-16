// Wrapper -------------------------------------------------------------------

// Context wrappers for unit tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import * as State from "./State";
import LibraryContext from "../components/libraries/LibraryContext";
import LoginContext from "../components/login/LoginContext";
import Library from "../models/Library";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

/**
 * Return a wrapper that surrounds the specified children with both a
 * LoginContext and a LibraryContext instance.
 *
 * @param children                      Child components to be wrapped
 * @param user                          User to be logged in [not logged in]
 * @param library                       Currently selected Library [none]
 */
// @ts-ignore
export const libraryContext = ({children}, user: User | null, library: Library | null): JSX.Element => {
    const libraryState = State.libraryContext(user, library);
    const loginState = State.loginContext(user);
    return (
        <LoginContext.Provider value={loginState}>
            <LibraryContext.Provider value={libraryState}>
                {children}
            </LibraryContext.Provider>
        </LoginContext.Provider>
    )
}

/**
 * Return a wrapper that surrounds the specified children with a LoginContext
 * instance.
 *
 * @param children                      Child components to be wrapped
 * @param user                          User to be logged in [not logged in]
 */
// @ts-ignore
export const loginContext = ({children}, user: User | null): JSX.Element => {
    const loginState = State.loginContext(user);
    return (
        <LoginContext.Provider value={loginState}>
            {children}
        </LoginContext.Provider>
    )
}

