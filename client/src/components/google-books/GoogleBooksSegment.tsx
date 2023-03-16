// GoogleBooksSegment --------------------------------------------------------

// Consolidated segment view of Google Books search results and details.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import GoogleBooksOptions from "./GoogleBooksOptions";
import LoginContext from "../login/LoginContext";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

enum View {
    DETAILS = "Details",
    OPTIONS = "Options",
}

const GoogleBooksSegment = () => {

    const [view/*, setView*/] = useState<View>(View.OPTIONS);
    const loginContext = useContext(LoginContext);

    useEffect(() => {
        logger.debug({
            context: "GoogleBooksSegment.useEffect",
            view: view.toString(),
        });
    }, [view, loginContext.user]);

    return (
        <>

            {(view === View.OPTIONS) ? (
                <GoogleBooksOptions
                    apiKey={loginContext.user.googleBooksApiKey}
                />
            ) : null}

        </>
    )

}

export default GoogleBooksSegment;
