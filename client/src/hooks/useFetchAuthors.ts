// useFetchAuthors -----------------------------------------------------------

// Custom hook to fetch Author objects that correspond to input properties.

// If a "name" parameter is set, the match will be against all Authors
// for the owning Library.  Otherwise, all Authors that correspond to the
// specified "parent" object will be returned.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleAction, Parent} from "../types";
import ApiFetcher from "../fetchers/ApiFetcher";
import LibraryContext from "../components/libraries/LibraryContext";
import LoginContext from "../components/login/LoginContext";
import Author, {AUTHORS_BASE} from "../models/Author";
import {LIBRARIES_BASE} from "../models/Library";
import Series, {SERIES_BASE} from "../models/Series";
import Story, {STORIES_BASE} from "../models/Story";
import Volume, {VOLUMES_BASE} from "../models/Volume";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as Sorters from "../util/Sorters";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Authors? [false]
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
    currentPage?: number;               // One-relative page number [1]
    name?: string;                      // Select Authors with matching name? [none]
    pageSize?: number;                  // Number of Authors to be returned [25]
    parent: Parent;                     // Parent object for retrieval
    withSeries?: boolean;               // Include child Series? [false]
    withStories?: boolean;              // Include child Stories? [false]
    withVolumes?: boolean;              // Include child Volumes? [false]
}

export interface State {
    authors: Author[];                  // Fetched Authors
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    refresh: HandleAction;              // Trigger a refresh
}

// Hook Details --------------------------------------------------------------

const useFetchAuthors = (props: Props): State => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const alertPopup = (props.alertPopup !== undefined) ? props.alertPopup : true;
    const [authors, setAuthors] = useState<Author[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {

        const fetchAuthors = async () => {

            setError(null);
            setLoading(true);
            let theAuthors: Author[] = [];

            const limit = props.pageSize ? props.pageSize : 25;
            const offset = props.currentPage ? (limit * (props.currentPage - 1)) : 0;
            const parameters = {
                active: props.active ? "" : undefined,
                limit: limit,
                name: props.name ? props.name : undefined,
                offset: offset,
                withSeries: props.withSeries ? "" : undefined,
                withStories: props.withStories ? "" : undefined,
                withVolumes: props.withVolumes ? "" : undefined,
            }
            let url = LIBRARIES_BASE + `/${libraryContext.library.id}` + AUTHORS_BASE;
            if (!props.name && (props.parent instanceof Series)) {
                url = SERIES_BASE + `/${libraryContext.library.id}/${props.parent.id}` + AUTHORS_BASE;
            } else if (!props.name && (props.parent instanceof Story)) {
                url = STORIES_BASE + `/${libraryContext.library.id}/${props.parent.id}` + AUTHORS_BASE;
            } else if (!props.name && (props.parent instanceof Volume)) {
                url = VOLUMES_BASE + `/${libraryContext.library.id}/${props.parent.id}` + AUTHORS_BASE;
            }
            url += queryParameters(parameters);

            try {
                let tryFetch = loginContext.data.loggedIn && (libraryContext.library.id > 0);
                if (props.parent && (props.parent.id < 0)) {
                    tryFetch = false;
                }
                if (tryFetch) {
                    theAuthors = ToModel.AUTHORS(await ApiFetcher.get(url));
                    theAuthors.forEach(theAuthor => {
                        if (theAuthor.series && (theAuthor.series.length > 0)) {
                            theAuthor.series = Sorters.SERIESES(theAuthor.series);
                        }
                        if (theAuthor.stories && (theAuthor.stories.length > 0)) {
                            theAuthor.stories = Sorters.STORIES(theAuthor.stories);
                        }
                        if (theAuthor.volumes && (theAuthor.volumes.length > 0)) {
                            theAuthor.volumes = Sorters.VOLUMES(theAuthor.volumes);
                        }
                    });
                    logger.debug({
                        context: "useFetchAuthors.fetchAuthors",
                        url: url,
                        authors: Abridgers.AUTHORS(theAuthors),
                    });
                } else {
                    logger.debug({
                        context: "useFetchAuthors.fetchAuthors",
                        msg: "Skipped fetching Authors",
                        url: url,
                        loggedIn: loginContext.data.loggedIn,
                    });
                }
            } catch (anError) {
                setError(anError as Error);
                ReportError("useFetchAuthors.fetchAuthors", anError, {
                    url: url,
                }, alertPopup);
            }

            setAuthors(theAuthors);
            setLoading(false);
            setRefresh(false);

        }

        fetchAuthors();

    }, [props.active, props.currentPage, props.name, props.pageSize,
        props.parent, props.withSeries, props.withStories, props.withVolumes,
        libraryContext.library, libraryContext.library.id,
        loginContext.data.loggedIn,
        alertPopup, refresh]);

    const handleRefresh: HandleAction = () => {
        logger.debug({
            context: "useFetchAuthors.handleRefresh",
            library: Abridgers.LIBRARY(libraryContext.library),
            parent: Abridgers.ANY(props.parent),
            active: props.active,
            name: props.name,
        });
        setRefresh(true);
    }

    return {
        authors: authors,
        error: error ? error : null,
        loading: loading,
        refresh: handleRefresh,
    }

}

export default useFetchAuthors;
