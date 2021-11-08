// useFetchParent ------------------------------------------------------------

// Custom hook to fetch a parent object, fleshed out with all of its child
// objects.  It uses the instance type and ID of the "parent" object passed
// as a property to pick the object to be fetched.

// Internal Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import LibraryContext from "../components/libraries/LibraryContext";
import LoginContext from "../components/login/LoginContext";
import Author, {AUTHORS_BASE} from "../models/Author";
import Library from "../models/Library";
import Series, {SERIES_BASE} from "../models/Series";
import Story, {STORIES_BASE} from "../models/Story";
import Volume, {VOLUMES_BASE} from "../models/Volume";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as Sorters from "../util/Sorters";
import * as ToModel from "../util/ToModel";
import {HandleAction, Parent} from "../types";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    parent: Parent;                     // Parent object (only uses ID and class)
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    parent: Parent;                     // Fully fleshed out fetched object
    refresh: HandleAction;              // Callback to trigger a refresh
}

// Hook Details --------------------------------------------------------------

const useFetchParent = (props: Props): State => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [parent, setParent] = useState<Parent>(libraryContext.library);
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {

        let parameters: object = {};

        const fetchAuthor = async () => {
            let theAuthor = new Author();
            parameters = {
                withSeries: "",
                withStories: "",
                withVolumes: "",
            }
            const url = AUTHORS_BASE +
                `/${libraryContext.library.id}/${props.parent.id}${queryParameters(parameters)}`;
            let tryFetch = loginContext.data.loggedIn && (props.parent.id > 0);
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
                    context: "useFetchParent.fetchAuthor",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    url: url,
                    author: Abridgers.AUTHOR(theAuthor),
                });
                setParent(theAuthor);
            } else {
                logger.debug({
                    context: "useFetchParent.fetchAuthor",
                    msg: "Skipped fetching Author",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    url: url,
                    loggedIn: loginContext.data.loggedIn,
                });
            }
        }

        const fetchSeries = async () => {
            let theSeries = new Series();
            parameters = {
                withAuthors: "",
                withStories: "",
            }
            const url = SERIES_BASE +
                `/${libraryContext.library.id}/${props.parent.id}${queryParameters(parameters)}`;
            let tryFetch = loginContext.data.loggedIn && (props.parent.id > 0);
            if (tryFetch) {
                theSeries = ToModel.SERIES((await Api.get(url)).data);
                if (theSeries.authors && (theSeries.authors.length > 0)) {
                    theSeries.authors = Sorters.AUTHORS(theSeries.authors);
                }
                if (theSeries.stories && (theSeries.stories.length > 0)) {
                    theSeries.stories = Sorters.STORIES(theSeries.stories);
                }
                logger.debug({
                    context: "useFetchParent.fetchSeries",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    url: url,
                    series: Abridgers.SERIES(theSeries),
                });
                setParent(theSeries);
            } else {
                logger.debug({
                    context: "useFetchParent.fetchSeries",
                    msg: "Skipped fetching Series",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    url: url,
                    loggedIn: loginContext.data.loggedIn,
                });
            }
        }

        const fetchStory = async () => {
            let theStory = new Story();
            parameters = {
                withAuthors: "",
                withSeries: "",
                withVolumes: "",
            }
            const url = STORIES_BASE +
                `/${libraryContext.library.id}/${props.parent.id}${queryParameters(parameters)}`;
            let tryFetch = loginContext.data.loggedIn && (props.parent.id > 0);
            if (tryFetch) {
                theStory = ToModel.STORY((await Api.get(url)).data);
                if (theStory.authors && (theStory.authors.length > 0)) {
                    theStory.authors = Sorters.AUTHORS(theStory.authors);
                }
                if (theStory.series && (theStory.series.length > 0)) {
                    theStory.series = Sorters.SERIESES(theStory.series);
                }
                if (theStory.volumes && (theStory.volumes.length > 0)) {
                    theStory.volumes = Sorters.VOLUMES(theStory.volumes);
                }
                logger.debug({
                    context: "useFetchParent.fetchStory",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    url: url,
                    story: Abridgers.STORY(theStory),
                });
                setParent(theStory);
            } else {
                logger.debug({
                    context: "useFetchParent.fetchStory",
                    msg: "Skipped fetching Story",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    url: url,
                    loggedIn: loginContext.data.loggedIn,
                });
            }
        }

        const fetchVolume = async () => {
            let theVolume = new Volume();
            parameters = {
                withAuthors: "",
                withStories: "",
            }
            const url = VOLUMES_BASE +
                `/${libraryContext.library.id}/${props.parent.id}${queryParameters(parameters)}`;
            let tryFetch = loginContext.data.loggedIn && (props.parent.id > 0);
            if (tryFetch) {
                theVolume = ToModel.VOLUME((await Api.get(url)).data);
                if (theVolume.authors && (theVolume.authors.length > 0)) {
                    theVolume.authors = Sorters.AUTHORS(theVolume.authors);
                }
                if (theVolume.stories && (theVolume.stories.length > 0)) {
                    theVolume.stories = Sorters.STORIES(theVolume.stories);
                }
                logger.debug({
                    context: "useFetchParent.fetchVolume",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    url: url,
                    volume: Abridgers.VOLUME(theVolume),
                });
                setParent(theVolume);
            } else {
                logger.debug({
                    context: "useFetchParent.fetchVolume",
                    msg: "Skipped fetching Volume",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    url: url,
                    loggedIn: loginContext.data.loggedIn,
                });
            }
        }

        setError(null);
        setLoading(true);
        try {
            if (props.parent instanceof Author) {
                fetchAuthor();
            } else if (props.parent instanceof Library) {
                setParent(libraryContext.library);
            } else if (props.parent instanceof Series) {
                fetchSeries();
            } else if (props.parent instanceof Story) {
                fetchStory();
            } else if (props.parent instanceof Volume) {
                fetchVolume();
            }
        } catch (error) {
            setError(error as Error);
            ReportError("useFetchParent.useEffect", error, {
                library: Abridgers.LIBRARY(libraryContext.library),
                parentId: props.parent.id,
                parentModel: props.parent._model,
                parameters: parameters,
            });
        }
        setLoading(false);
        setRefresh(false);

    }, [props.parent, props.parent.id, refresh,
        libraryContext.library, libraryContext.library.id,
        loginContext.data.loggedIn]);

    const handleRefresh: HandleAction = () => {
        logger.info({
            context: "useFetchParent.handleRefresh",
            parent: Abridgers.ANY(parent),
        });
        setRefresh(true);
    }

    return {
        error: error ? error : null,
        loading: loading,
        parent: parent,
        refresh: handleRefresh,
    }

}

export default useFetchParent;
