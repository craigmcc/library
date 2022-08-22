// TestLogin -----------------------------------------------------------------

// Dummy component allowing tests to simulate login operations that
// will affect the LoginContext provider they are wrapped inside.

// THIS COMPONENT IS FOR TESTS ONLY, NOT FOR USE IN PRODUCTION CODE!

// External Modules ----------------------------------------------------------

import {useContext, useEffect} from "react";

// Internal Modules ----------------------------------------------------------

import LoginContext from "../components/login/LoginContext";
import logger from "../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    scope: string;                      // Simulated scope to log in
}

// Component Details --------------------------------------------------------

const TestLogin = (props: Props) => {

    const loginContext = useContext(LoginContext);

    useEffect(() => {
        logger.info({
            context: "TestLogin.useEffect",
            scope: props.scope,
        });
        loginContext.handleLogin({ username: "testuser", password: "testpass"})
    }, [props.scope]);

    return null;

}

export default TestLogin;
