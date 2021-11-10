// useFetchStories -----------------------------------------------------------

// Custom hook to fetch Story objects that correspond to input properties.

// If a "name" parameter is set, the match will be against all Stories
// for the owning Library.  Otherwise, all Stories that correspond to the
// specified "parent" object will be returned.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {Parent} from "../types";
import Api from "../clients/Api";
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
    active?: boolean;                   // Select only active Stories? [false]
    currentPage?: number;               // One-relative page number [1]
    name?: string;                      // Select Stories with matching name? [none]
    pageSize?: number;                  // Number of Stories to be returned [25]
    parent: Parent;                     // Parent object for retrieval
    withAuthors?: boolean;              // Include child Authors? [false]
    withSeries?: boolean;               // Include child Series? [false]
    withVolumes?: boolean;              // Include child Volumes? [false]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    stories: Story[];                  // Fetched Stories
}

// Hook Details --------------------------------------------------------------

const useFetchStories = (props: Props): State => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [stories, setStories] = useState<Story[]>([]);

    useEffect(() => {

        const fetchStories = async () => {

            setError(null);
            setLoading(true);
            let theStories: Story[] = [];

            const limit = props.pageSize ? props.pageSize : 25;
            const offset = props.currentPage ? (limit * (props.currentPage - 1)) : 0;
            const parameters = {
                active: props.active ? "" : undefined,
                limit: limit,
                name: props.name ? props.name : undefined,
                offset: offset,
                withAuthors: props.withAuthors ? "" : undefined,
                withSeries: props.withSeries ? "" : undefined,
                withVolumes: props.withVolumes ? "" : undefined,
            }
            let url = LIBRARIES_BASE + `/${libraryContext.library.id}` + STORIES_BASE;
            if (!props.name && (props.parent instanceof Author)) {
                url = AUTHORS_BASE + `/${libraryContext.library.id}/${props.parent.id}` + STORIES_BASE;
            } else if (!props.name && (props.parent instanceof Series)) {
                url = SERIES_BASE + `/${libraryContext.library.id}/${props.parent.id}` + STORIES_BASE;
            } else if (!props.name && (props.parent instanceof Volume)) {
                url = VOLUMES_BASE + `/${libraryContext.library.id}/${props.parent.id}` + STORIES_BASE;
            }
            url += queryParameters(parameters);

            try {
                let tryFetch = loginContext.data.loggedIn && (libraryContext.library.id > 0);
                if (props.parent && (props.parent.id < 0)) {
                    tryFetch = false;
                }
                if (tryFetch) {
                    theStories = ToModel.STORIES((await Api.get(url)).data);
                    theStories.forEach(theStory => {
                        if (theStory.authors && (theStory.authors.length > 0)) {
                            theStory.authors = Sorters.AUTHORS(theStory.authors);
                        }
                        if (theStory.series && (theStory.series.length > 0)) {
                            theStory.series = Sorters.SERIESES(theStory.series);
                        }
                        if (theStory.volumes && (theStory.volumes.length > 0)) {
                            theStory.volumes = Sorters.VOLUMES(theStory.volumes);
                        }
                    });
                    logger.info({
                        context: "useFetchStories.fetchStories",
                        library: Abridgers.LIBRARY(libraryContext.library),
                        parent: Abridgers.ANY(props.parent),
                        active: props.active,
                        name: props.name,
                        url: url,
                        stories: Abridgers.STORIES(theStories),
                    });
                } else {
                    logger.info({
                        context: "useFetchStories.fetchStories",
                        msg: "Skipped fetching Stories",
                        library: Abridgers.LIBRARY(libraryContext.library),
                        parent: Abridgers.ANY(props.parent),
                        active: props.active,
                        name: props.name,
                        url: url,
                        loggedIn: loginContext.data.loggedIn,
                    });
                }
            } catch (error) {
                setError(error as Error);
                ReportError("useFetchStories.fetchStories", error, {
                    parameters: parameters,
                    url: url,
                    library: Abridgers.LIBRARY(libraryContext.library),
                    parent: Abridgers.ANY(props.parent),
                    loggedIn: loginContext.data.loggedIn,
                });
            }

            setStories(theStories);
            setLoading(false);

        }

        fetchStories();

    }, [props.active, props.currentPage, props.name, props.pageSize,
        props.parent, props.withAuthors, props.withSeries, props.withVolumes,
        libraryContext.library, libraryContext.library.id,
        loginContext.data.loggedIn]);

    return {
        error: error ? error : null,
        loading: loading,
        stories: stories,
    }

}

export default useFetchStories;
