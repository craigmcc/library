// TestLogout ----------------------------------------------------------------

// Dummy component allowing tests to simulate logout operations that
// will affect the LoginContext provider they are wrapped inside.

// THIS COMPONENT IS FOR TESTS ONLY, NOT FOR USE IN PRODUCTION CODE!

// External Modules ----------------------------------------------------------

import {useContext, useEffect} from "react";

// Internal Modules ----------------------------------------------------------

import LoginContext from "../components/login/LoginContext";
import logger from "../util/ClientLogger";

// Component Details ---------------------------------------------------------

const TestLogout = () => {

    const loginContext = useContext(LoginContext);

    useEffect(() => {
        logger.info({
            context: "TestLogout.useEffect",
        });
        loginContext.handleLogout();
    }, []);

    return null;

}

export default TestLogout;
