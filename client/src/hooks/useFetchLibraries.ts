// useFetchLibraries ---------------------------------------------------------

// Custom hook to fetch Library objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import LoginContext from "../components/login/LoginContext";
import Library, {LIBRARIES_BASE} from "../models/Library";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as Sorters from "../util/Sorters";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Libraries? [false]
    currentPage?: number;               // One-relative page number [1]
    name?: string;                      // Select Libraries with matching name? [none]
    pageSize?: number;                  // Number of Libraries to be returned [25]
    scope?: string;                     // Select Libraries with exact scope? [none]
    withAuthors?: boolean;              // Include child Authors? [false]
    withSeries?: boolean;               // Include child Series? [false]
    withStories?: boolean;              // Include child Stories? [false]
    withVolumes?: boolean;              // Include child Volumes? [false]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    libraries: Library[];               // Fetched Libraries
    loading: boolean;                   // Are we currently loading?
}

// Hook Details --------------------------------------------------------------

const useFetchLibraries = (props: Props): State => {

    const loginContext = useContext(LoginContext);

    const [error, setError] = useState<Error | null>(null);
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        const fetchLibraries = async () => {

            setError(null);
            setLoading(true);
            let theLibraries: Library[] = [];

            const limit = props.pageSize ? props.pageSize : 25;
            const offset = props.currentPage ? (limit * (props.currentPage - 1)) : 0;
            const parameters = {
                active: props.active ? "" : undefined,
                limit: limit,
                name: props.name ? props.name : undefined,
                offset: offset,
                scope: props.scope ? props.scope : undefined,
                withAuthors: props.withAuthors ? "" : undefined,
                withSeries: props.withSeries ? "" : undefined,
                withStories: props.withStories ? "" : undefined,
                withVolumes: props.withVolumes ? "" : undefined,
            }

            try {
                if (loginContext.data.loggedIn) {
                    theLibraries = (await Api.get(LIBRARIES_BASE
                        + `${queryParameters(parameters)}`)).data;
                    theLibraries.forEach(theLibrary => {
                        if (theLibrary.authors && (theLibrary.authors.length > 0)) {
                            theLibrary.authors = Sorters.AUTHORS(theLibrary.authors);
                        }
                        if (theLibrary.series && (theLibrary.series.length > 0)) {
                            theLibrary.series = Sorters.SERIESES(theLibrary.series);
                        }
                        if (theLibrary.stories && (theLibrary.stories.length > 0)) {
                            theLibrary.stories = Sorters.STORIES(theLibrary.stories);
                        }
                        if (theLibrary.volumes && (theLibrary.volumes.length > 0)) {
                            theLibrary.volumes = Sorters.VOLUMES(theLibrary.volumes);
                        }
                    });
                    logger.debug({
                        context: "useFetchLibraries.fetchLibraries",
                        parameters: parameters,
                        libraries: Abridgers.LIBRARIES(theLibraries),
                    });
                }
            } catch (error) {
                setError(error as Error);
                ReportError("useFetchLibraries.fetchLibraries", error, {
                    parameters: parameters,
                });
            }

            setLibraries(theLibraries);
            setLoading(false);

        }

        fetchLibraries();

    }, [props.active, props.currentPage, props.name,
        props.pageSize, props.scope, props.withAuthors,
        props.withSeries, props.withStories, props.withVolumes,
        loginContext.data.loggedIn]);

    return {
        error: error ? error : null,
        libraries: libraries,
        loading: loading,
    }

}

export default useFetchLibraries;
