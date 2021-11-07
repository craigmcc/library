// useFetchVolumes ---------------------------------------------------------

// Custom hook to fetch Volume objects that correspond to input properties.

// If a "name" parameter is set, the match will be against all Volumes
// for the owning Library.  Otherwise, all Volumes that correspond to the
// specified "parent" object will be returned.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import LibraryContext from "../components/libraries/LibraryContext";
import LoginContext from "../components/login/LoginContext";
import Author, {AUTHORS_BASE} from "../models/Author";
import {LIBRARIES_BASE} from "../models/Library";
import Story, {STORIES_BASE} from "../models/Story";
import Volume, {VOLUMES_BASE} from "../models/Volume";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as Sorters from "../util/Sorters";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Volumes? [false]
    currentPage?: number;               // One-relative page number [1]
    name?: string;                      // Select Volumes with matching name? [none]
    pageSize?: number;                  // Number of Volumes to be returned [25]
    parent?: Author | Story;            // Parent object for retrieval [owning Library]
    withAuthors?: boolean;              // Include child Authors? [false]
    withStories?: boolean;              // Include child Stories? [false]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    volumes: Volume[];                  // Fetched Volumes
}

// Hook Details --------------------------------------------------------------

const useFetchVolumes = (props: Props): State => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [error, setError] = useState<Error | null>(null);
    const [volumes, setVolumes] = useState<Volume[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        const fetchVolumes = async () => {

            setError(null);
            setLoading(true);
            let theVolumes: Volume[] = [];

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
            let url = LIBRARIES_BASE + `/${libraryContext.library.id}` + VOLUMES_BASE;
            if (props.parent && (props.parent instanceof Author)) {
                url = AUTHORS_BASE + `/${libraryContext.library.id}/${props.parent.id}` + VOLUMES_BASE;
            } else if (props.parent && (props.parent instanceof Story)) {
                url = STORIES_BASE + `/${libraryContext.library.id}/${props.parent.id}` + VOLUMES_BASE;
            }
            url += queryParameters(parameters);

            try {
                if (loginContext.data.loggedIn && (libraryContext.library.id > 0)) {
                    theVolumes = (await Api.get(url)).data;
                    theVolumes.forEach(theVolume => {
                        if (theVolume.authors && (theVolume.authors.length > 0)) {
                            theVolume.authors = Sorters.AUTHORS(theVolume.authors);
                        }
                        if (theVolume.stories && (theVolume.stories.length > 0)) {
                            theVolume.stories = Sorters.STORIES(theVolume.stories);
                        }
                    });
                    logger.debug({
                        context: "useFetchVolumes.fetchVolumes",
                        parameters: parameters,
                        volumes: Abridgers.VOLUMES(theVolumes),
                    });
                }
            } catch (error) {
                setError(error as Error);
                ReportError("useFetchVolumes.fetchVolumes", error, {
                    parameters: parameters,
                });
            }

            setVolumes(theVolumes);
            setLoading(false);

        }

        fetchVolumes();

    }, [props.active, props.currentPage, props.name,
        props.pageSize, props.parent, props.withAuthors, props.withStories,
        libraryContext.library.id, loginContext.data.loggedIn]);

    return {
        error: error ? error : null,
        loading: loading,
        volumes: volumes,
    }

}

export default useFetchVolumes;
