// GoogleBooksSegment --------------------------------------------------------

// Consolidated segment view of Google Books search results and details.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import GoogleBooksOptions from "./GoogleBooksOptions";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

enum View {
    DETAILS = "Details",
    OPTIONS = "Options",
}

const GoogleBooksSegment = () => {

    const [view, setView] = useState<View>(View.OPTIONS);

    useEffect(() => {
        logger.debug({
            context: "GoogleBooksSegment.useEffect",
            view: view.toString(),
        });
    }, [view]);

}

export default GoogleBooksSegment;
