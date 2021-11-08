// useFetchAuthor ------------------------------------------------------------

// Custom hook to fetch the Author with the specified ID, with all nested
// objects, as long as it belongs to the current Library.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import LibraryContext from "../components/libraries/LibraryContext";
import LoginContext from "../components/login/LoginContext";
import Author, {AUTHORS_BASE} from "../models/Author";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as Sorters from "../util/Sorters";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    authorId: number;                   // ID of the Author to be fetched
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    author: Author;                     // Fetched Author
}

// Hook Details --------------------------------------------------------------

const useFetchAuthor = (props: Props): State => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [author, setAuthor] = useState<Author>(new Author());
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        const fetchAuthor = async () => {

            setError(null);
            setLoading(true);
            let theAuthor = new Author();
            const parameters = {
                withSeries: "",
                withStories: "",
                withVolumes: "",
            }
            let url = AUTHORS_BASE +
                `/${libraryContext.library.id}/${props.authorId}${queryParameters(parameters)}`;

            try {
                let tryFetch = loginContext.data.loggedIn && (props.authorId > 0);
                if (tryFetch) {
                    theAuthor = ToModel.AUTHOR((await Api.get(url)).data);
                    if (theAuthor.series && (theAuthor.series.length > 0)) {
                        theAuthor.series = Sorters.SERIESES(theAuthor.series);
                    }
                    if (theAuthor.stories && (theAuthor.stories.length > 0)) {
                        theAuthor.stories = Sorters.STORIES(theAuthor.stories);
                    }
                    if (theAuthor.volumes && (theAuthor.volumes.length > 0)) {
                        theAuthor.volumes = Sorters.VOLUMES(theAuthor.volumes);
                    }
                    logger.debug({
                        context: "useFetchAuthor.fetchAuthor",
                        library: Abridgers.LIBRARY(libraryContext.library),
                        url: url,
                        author: Abridgers.AUTHOR(theAuthor),
                    });
                } else {
                    logger.debug({
                        context: "useFetchAuthor.fetchAuthor",
                        msg: "Skipped fetching Author",
                        library: Abridgers.LIBRARY(libraryContext.library),
                        url: url,
                        loggedIn: loginContext.data.loggedIn,
                    });
                }
            } catch (error) {
                setError(error as Error);
                ReportError("useFetchAuthor.fetchAuthor", error, {
                    library: Abridgers.LIBRARY(libraryContext.library),
                    authorId: props.authorId,
                    parameters: parameters,
                });
            }

            setAuthor(theAuthor);
            setLoading(false);

        }

        fetchAuthor();

    }, [props.authorId, libraryContext.library, loginContext.data.loggedIn]);

    return {
        author: author,
        error: error ? error : null,
        loading: loading,
    }

}

export default useFetchAuthor;
