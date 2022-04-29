// GoogleBooksSegment --------------------------------------------------------

// Consolidated segment view of Google Books search results and details.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import {FetchingProgress} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import GoogleBooksOptions from "./GoogleBooksOptions";
import useFetchMe from "../../hooks/useFetchMe";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

enum View {
    DETAILS = "Details",
    OPTIONS = "Options",
}

const GoogleBooksSegment = () => {

    const [view/*, setView*/] = useState<View>(View.OPTIONS);

    const fetchMe = useFetchMe({
        alertPopup: false,
    });

    useEffect(() => {
        logger.debug({
            context: "GoogleBooksSegment.useEffect",
            view: view.toString(),
        });
    }, [view, fetchMe.me, fetchMe.me.googleBooksApiKey]);

    return (
        <>

            <FetchingProgress
                error={fetchMe.error}
                loading={fetchMe.loading}
                message="Fetching User Profile"
            />

            {(view === View.OPTIONS) ? (
                <GoogleBooksOptions
                    apiKey={fetchMe.me.googleBooksApiKey}
                />
            ) : null}

        </>
    )

}

export default GoogleBooksSegment;
