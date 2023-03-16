// useFetchGoogleBooks -------------------------------------------------------

// Custom hook to fetch a list of Google Books API "Volume" objects
// that match the request criteria.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import GoogleVolumes from "../models/GoogleVolumes";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
    apiKey: string;                     // API Key for Google Books API
    limit?: number;                     // Maximum books to retrieve [10]
    newest?: boolean;                   // Sort by newest not relevance? [false]
    query: string;                      // Query expression (will be URL encoded)
    offset?: number;                    // Zero-relative offset to first result [0]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    volumes: GoogleVolumes;             // Fetched volumes
}

// Hook Details --------------------------------------------------------------

const BASE_URL = "https://www.googleapis.com/books/v1";

const useFetchGoogleBooks = (props: Props): State => {

    const alertPopup = (props.alertPopup !== undefined) ? props.alertPopup : true;
    const [books, setBooks] = useState<object>({});
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        const fetchBooks = async () => {

            setError(null);
            setLoading(true);
            let theBooks: GoogleVolumes = {};

            const parameters = {
                maxResults: props.limit ? props.limit : undefined,
                orderBy: props.newest ? "newest" : undefined,
                startIndex: props.offset ? props.offset : undefined,
                q: encodeURIComponent(props.query),
            }
            const url = `${BASE_URL}/volumes${queryParameters(parameters)}`;

            try {
                if (props.query !== "") {
                    const response = await fetch(`${url}&${props.apiKey}`);
                    theBooks = await response.json();
                }
                logger.debug({
                    context: "useFetchGoogleBooks.fetchBooks",
                    url: url,
                });
            } catch (anError) {
                setError(anError as Error);
                ReportError("useFetchGoogleBooks.fetchBooks", anError, {
                    url: url,
                }, alertPopup);
            }

            setBooks(theBooks);
            setLoading(false);

        }

        fetchBooks();

    }, [props.apiKey, props.limit, props.newest,
        props.offset, props.query, alertPopup]);

    return {
        error: error,
        loading: loading,
        volumes: books,
    }

}

export default useFetchGoogleBooks;
