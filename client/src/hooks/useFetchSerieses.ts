// useFetchSerieses ---------------------------------------------------------

// Custom hook to fetch Series objects that correspond to input properties.

// If a "name" parameter is set, the match will be against all Serieses
// for the owning Library.  Otherwise, all Serieses that correspond to the
// specified "parent" object will be returned.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleAction, Parent} from "../types";
import Api from "../clients/Api";
import LibraryContext from "../components/libraries/LibraryContext";
import LoginContext from "../components/login/LoginContext";
import Author, {AUTHORS_BASE} from "../models/Author";
import {LIBRARIES_BASE} from "../models/Library";
import Story, {STORIES_BASE} from "../models/Story";
import Series, {SERIES_BASE} from "../models/Series";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as Sorters from "../util/Sorters";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Serieses? [false]
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
    currentPage?: number;               // One-relative page number [1]
    name?: string;                      // Select Serieses with matching name? [none]
    pageSize?: number;                  // Number of Serieses to be returned [25]
    parent: Parent;                     // Parent object for retrieval
    withAuthors?: boolean;              // Include child Authors? [false]
    withStories?: boolean;              // Include child Stories? [false]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    refresh: HandleAction;              // Trigger a refresh
    serieses: Series[];                 // Fetched Series
}

// Hook Details --------------------------------------------------------------

const useFetchSerieses = (props: Props): State => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [serieses, setSerieses] = useState<Series[]>([]);

    useEffect(() => {

        const fetchSerieses = async () => {

            setError(null);
            setLoading(true);
            let theSerieses: Series[] = [];

            const limit = props.pageSize ? props.pageSize : 25;
            const offset = props.currentPage ? (limit * (props.currentPage - 1)) : 0;
            const parameters = {
                active: props.active ? "" : undefined,
                limit: limit,
                name: props.name ? props.name : undefined,
                offset: offset,
                withAuthors: props.withAuthors ? "" : undefined,
                withStories: props.withStories ? "" : undefined,
            }
            let url = LIBRARIES_BASE + `/${libraryContext.library.id}` + SERIES_BASE;
            if (!props.name && (props.parent instanceof Author)) {
                url = AUTHORS_BASE + `/${libraryContext.library.id}/${props.parent.id}` + SERIES_BASE;
            } else if (!props.name && (props.parent instanceof Story)) {
                url = STORIES_BASE + `/${libraryContext.library.id}/${props.parent.id}` + SERIES_BASE;
            }
            url += queryParameters(parameters);

            try {
                let tryFetch = loginContext.data.loggedIn && (libraryContext.library.id > 0);
                if (tryFetch) {
                    theSerieses = ToModel.SERIESES((await Api.get<Series[]>(url)).data);
                    theSerieses.forEach(theSeries => {
                        if (theSeries.authors && (theSeries.authors.length > 0)) {
                            theSeries.authors = Sorters.AUTHORS(theSeries.authors);
                        }
                        if (theSeries.stories && (theSeries.stories.length > 0)) {
                            theSeries.stories = Sorters.STORIES(theSeries.stories);
                        }
                    });
                    logger.debug({
                        context: "useFetchSerieses.fetchSerieses",
                        url: url,
                        serieses: Abridgers.SERIESES(theSerieses),
                    });
                } else {
                    logger.debug({
                        context: "useFetchSerieses.fetchSerieses",
                        msg: "Skipped fetching Series",
                        url: url,
                        loggedIn: loginContext.data.loggedIn,
                    });
                }
            } catch (anError) {
                setError(anError as Error);
                ReportError("useFetchSerieses.fetchSerieses", anError, {
                    url: url,
                    loggedIn: loginContext.data.loggedIn,
                }, alertPopup);
            }

            setSerieses(theSerieses);
            setLoading(false);
            setRefresh(false);

        }

        fetchSerieses();

    }, [props.active, props.currentPage, props.name, props.pageSize,
        props.parent, props.withAuthors, props.withStories,
        libraryContext.library, libraryContext.library.id,
        loginContext.data.loggedIn,
        alertPopup, refresh]);

    const handleRefresh: HandleAction = () => {
        logger.debug({
            context: "useFetchSerieses.handleRefresh",
            library: Abridgers.LIBRARY(libraryContext.library),
            parent: Abridgers.ANY(props.parent),
            active: props.active,
            name: props.name,
        });
        setRefresh(true);
    }

    return {
        error: error ? error : null,
        loading: loading,
        refresh: handleRefresh,
        serieses: serieses,
    }

}

export default useFetchSerieses;
