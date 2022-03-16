// Wrapper -------------------------------------------------------------------

// Context wrappers for unit tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import * as State from "./State";
import LoginContext from "../components/login/LoginContext";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

/**
 * Return a wrapper that surrounds the specified children with a LoginContext
 * instance (and a Router instance because this component utilizes useNavigate).
 *
 * @param children                      Child components to be wrapped
 * @param user                          User to be logged in [not logged in]
 */
// @ts-ignore
export const loginContext = ({children}, user: User | null): JSX.Element => {
    const state = State.loginContext(user);
    return (
        <LoginContext.Provider value={state}>
            {children}
        </LoginContext.Provider>
    )
}

