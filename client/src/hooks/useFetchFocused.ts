// useFetchFocused -----------------------------------------------------------

// Custom hook to fetch an object to focus on, fleshed out with any related
// child objects.  It uses the instance type and ID of the "focusee" object
// passed as a property to select the object to be fetched.

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
import {HandleAction, Focus} from "../types";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    focusee: Focus;                     // Object to be fetched (only uses ID and class)
}

export interface State {
    error: Error | null;                // I/O error (if any)
    focused: Focus;                     // Fully fleshed out fetched object
    loading: boolean;                   // Are we currently loading?
    refresh: HandleAction;              // Callback to trigger a refresh
}

// Hook Details --------------------------------------------------------------

const useFetchFocused = (props: Props): State => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [error, setError] = useState<Error | null>(null);
    const [focused, setFocused] = useState<Focus>(libraryContext.library);
    const [loading, setLoading] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {

        logger.info({
            context: "useFetchFocused.useEffect",
            focusee: Abridgers.ANY(props.focusee),
            refresh: refresh,
        })

        let parameters: object = {};

        const fetchAuthor = async () => {
            let theAuthor = new Author();
            parameters = {
                withSeries: "",
                withStories: "",
                withVolumes: "",
            }
            const url = AUTHORS_BASE +
                `/${libraryContext.library.id}/${props.focusee.id}${queryParameters(parameters)}`;
            let tryFetch = loginContext.data.loggedIn && (props.focusee.id > 0);
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
                logger.info({
                    context: "useFetchFocused.fetchAuthor",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    refresh: refresh,
                    url: url,
                    author: Abridgers.AUTHOR(theAuthor),
                });
                setFocused(theAuthor);
            } else {
                logger.info({
                    context: "useFetchFocused.fetchAuthor",
                    msg: "Skipped fetching Author",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    refresh: refresh,
                    url: url,
                    loggedIn: loginContext.data.loggedIn,
                });
                setFocused(props.focusee);
            }
        }

        const fetchSeries = async () => {
            let theSeries = new Series();
            parameters = {
                withAuthors: "",
                withStories: "",
            }
            const url = SERIES_BASE +
                `/${libraryContext.library.id}/${props.focusee.id}${queryParameters(parameters)}`;
            let tryFetch = loginContext.data.loggedIn && (props.focusee.id > 0);
            if (tryFetch) {
                theSeries = ToModel.SERIES((await Api.get(url)).data);
                if (theSeries.authors && (theSeries.authors.length > 0)) {
                    theSeries.authors = Sorters.AUTHORS(theSeries.authors);
                }
                if (theSeries.stories && (theSeries.stories.length > 0)) {
                    theSeries.stories = Sorters.STORIES(theSeries.stories);
                }
                logger.info({
                    context: "useFetchFocused.fetchSeries",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    refresh: refresh,
                    url: url,
                    series: Abridgers.SERIES(theSeries),
                });
                setFocused(theSeries);
            } else {
                logger.info({
                    context: "useFetchFocused.fetchSeries",
                    msg: "Skipped fetching Series",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    refresh: refresh,
                    url: url,
                    loggedIn: loginContext.data.loggedIn,
                });
                setFocused(props.focusee);
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
                `/${libraryContext.library.id}/${props.focusee.id}${queryParameters(parameters)}`;
            let tryFetch = loginContext.data.loggedIn && (props.focusee.id > 0);
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
                logger.info({
                    context: "useFetchFocused.fetchStory",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    refresh: refresh,
                    url: url,
                    story: Abridgers.STORY(theStory),
                });
                setFocused(theStory);
            } else {
                logger.info({
                    context: "useFetchFocused.fetchStory",
                    msg: "Skipped fetching Story",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    refresh: refresh,
                    url: url,
                    loggedIn: loginContext.data.loggedIn,
                });
                setFocused(props.focusee);
            }
        }

        const fetchVolume = async () => {
            let theVolume = new Volume();
            parameters = {
                withAuthors: "",
                withStories: "",
            }
            const url = VOLUMES_BASE +
                `/${libraryContext.library.id}/${props.focusee.id}${queryParameters(parameters)}`;
            let tryFetch = loginContext.data.loggedIn && (props.focusee.id > 0);
            if (tryFetch) {
                theVolume = ToModel.VOLUME((await Api.get(url)).data);
                if (theVolume.authors && (theVolume.authors.length > 0)) {
                    theVolume.authors = Sorters.AUTHORS(theVolume.authors);
                }
                if (theVolume.stories && (theVolume.stories.length > 0)) {
                    theVolume.stories = Sorters.STORIES(theVolume.stories);
                }
                logger.info({
                    context: "useFetchFocused.fetchVolume",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    refresh: refresh,
                    url: url,
                    volume: Abridgers.VOLUME(theVolume),
                });
                setFocused(theVolume);
            } else {
                logger.info({
                    context: "useFetchFocused.fetchVolume",
                    msg: "Skipped fetching Volume",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    refresh: refresh,
                    url: url,
                    loggedIn: loginContext.data.loggedIn,
                });
                setFocused(props.focusee);
            }
        }

        setError(null);
        setLoading(true);
        try {
            if (props.focusee instanceof Author) {
                fetchAuthor();
            } else if (props.focusee instanceof Library) {
                setFocused(libraryContext.library);
            } else if (props.focusee instanceof Series) {
                fetchSeries();
            } else if (props.focusee instanceof Story) {
                fetchStory();
            } else if (props.focusee instanceof Volume) {
                fetchVolume();
            }
        } catch (error) {
            setError(error as Error);
            ReportError("useFetchFocused.useEffect", error, {
                library: Abridgers.LIBRARY(libraryContext.library),
                focusee: props.focusee,
                parameters: parameters,
                refresh: refresh,
            });
            setFocused(props.focusee);
        }
        setLoading(false);
        setRefresh(false);

    }, [props.focusee,
        refresh,
        libraryContext.library, libraryContext.library.id,
        loginContext.data.loggedIn]);

    const handleRefresh: HandleAction = () => {
        logger.info({
            context: "useFetchFocused.handleRefresh",
            parent: Abridgers.ANY(focused),
        });
        setRefresh(true);
    }

    return {
        error: error ? error : null,
        focused: focused,
        loading: loading,
        refresh: handleRefresh,
    }

}

export default useFetchFocused;
