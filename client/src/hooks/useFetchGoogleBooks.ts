// useFetchGoogleBooks -------------------------------------------------------

// Custom hook to fetch a list of Google Books API "Volume" objects
// that match the request criteria.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import GoogleBooksApi from "../clients/GoogleBooksApi";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
    apiKey: string;                     // API Key for Google Books API
    limit?: number;                     // Maximum books to retrieve [10]
    query: string;                      // Query expression (will be URL encoded)
    offset?: number;                    // Zero-relative offset to first result [0]
}

export interface State {
    books: object;                      // Fetched books (NOTE - need a collection type)
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
}

// Hook Details --------------------------------------------------------------

const useFetchGoogleBooks = (props: Props): State => {

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [books, setBooks] = useState<object>({});
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        const fetchBooks = async () => {

            setError(null);
            setLoading(true);
            let theBooks: object = {};

            const parameters = {
                key: props.apiKey,
                maxResults: props.limit ? props.limit : undefined,
                startIndex: props.offset ? props.offset : undefined,
                q: encodeURIComponent(props.query),
            }
            const url = `/volumes${queryParameters(parameters)}`;

            try {
                if (props.query !== "") {
                    theBooks = (await GoogleBooksApi.get(url)).data;
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

    }, [props.apiKey, props.limit, props.query, props.offset]);

    return {
        books: books,
        error: error,
        loading: loading,
    }

}

export default useFetchGoogleBooks;
