// useMutateStory ------------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Story.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {ProcessStory, ProcessStoryParent} from "../types";
import Api from "../clients/Api";
import LibraryContext from "../components/libraries/LibraryContext";
import Author, {AUTHORS_BASE} from "../models/Author";
import Series, {SERIES_BASE} from "../models/Series";
import Story, {STORIES_BASE} from "../models/Story";
import Volume, {VOLUMES_BASE} from "../models/Volume";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";
import {parentBase} from "../util/Transformations";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    exclude: ProcessStoryParent;        // Function to exclude an Story from a Parent
    include: ProcessStoryParent;        // Function to include an Story with a Parent
    insert: ProcessStory;               // Function to insert a new Story
    remove: ProcessStory;               // Function to remove an existing Story
    update: ProcessStory;               // Function to update an existing Story
}

// Component Details ---------------------------------------------------------

const useMutateStory = (props: Props = {}): State => {

    const libraryContext = useContext(LibraryContext);

    const alertPopup = (props.alertPopup !== undefined) ? props.alertPopup : true;
    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateStory.useEffect",
        });
    });

    const exclude: ProcessStoryParent = async (theStory, theParent) => {
        let url: string = "";
        if (theParent instanceof Author) {
            url = AUTHORS_BASE
                + `/${libraryContext.library.id}/${theParent.id}`
                + `${parentBase(theStory)}/${theStory.id}`;
        } else if (theParent instanceof Series) {
            url = SERIES_BASE
                + `/${libraryContext.library.id}/${theParent.id}`
                + `${parentBase(theStory)}/${theStory.id}`;
        } else if (theParent instanceof Volume) {
            url = VOLUMES_BASE
                + `/${libraryContext.library.id}/${theParent.id}`
                + `${parentBase(theStory)}/${theStory.id}`;
        }
        setError(null);
        setExecuting(true);
        try {
            await Api.delete(url);
            logger.debug({
                context: "useMutateStory.exclude",
                author: Abridgers.STORY(theStory),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateStory.exclude", anError, {
                author: Abridgers.STORY(theStory),
                parent: Abridgers.ANY(theParent),
                url: url,
            }, alertPopup);
        }
        setExecuting(false);
        return theStory;
    }

    const include: ProcessStoryParent = async (theStory, theParent) => {
        let url: string = "";
        if (theParent instanceof Author) {
            url = AUTHORS_BASE
                + `/${libraryContext.library.id}/${theParent.id}`
                + `${parentBase(theStory)}/${theStory.id}`;
        } else if (theParent instanceof Series) {
            const parameters = {
                ordinal: theStory.ordinal ? theStory.ordinal : undefined
            }
            url = SERIES_BASE
                + `/${libraryContext.library.id}/${theParent.id}`
                + `${parentBase(theStory)}/${theStory.id}${queryParameters(parameters)}`;
        } else if (theParent instanceof Volume) {
            url = VOLUMES_BASE
                + `/${libraryContext.library.id}/${theParent.id}`
                + `${parentBase(theStory)}/${theStory.id}`;
        }
        setError(null);
        setExecuting(true);
        try {
            await Api.post(url);
            logger.debug({
                context: "useMutateStory.include",
                story: Abridgers.STORY(theStory),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateStory.include", anError, {
                story: Abridgers.STORY(theStory),
                parent: Abridgers.ANY(theParent),
                url: url,
            }, alertPopup);
        }
        setExecuting(false);
        return theStory;
    }

    const insert: ProcessStory = async (theStory) => {

        const url = STORIES_BASE
            + `/${libraryContext.library.id}`;
        let inserted = new Story();
        setError(null);
        setExecuting(true);

        try {
            inserted = ToModel.STORY((await Api.post(url, theStory)).data);
            logger.debug({
                context: "useMutateStory.insert",
                story: Abridgers.STORY(inserted),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateStory.insert", anError, {
                story: Abridgers.STORY(theStory),
                url: url,
            }, alertPopup);
        }

        setExecuting(false);
        return inserted;

    }

    const remove: ProcessStory = async (theStory): Promise<Story> => {

        const url = STORIES_BASE
            + `/${libraryContext.library.id}/${theStory.id}`;
        let removed = new Story();
        setError(null);
        setExecuting(true);

        try {
            removed = ToModel.STORY((await Api.delete(url)).data);
            logger.debug({
                context: "useMutateStory.remove",
                story: Abridgers.STORY(removed),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateStory.remove", anError, {
                story: ToModel.STORY(theStory),
                url: url,
            }, alertPopup);
        }

        setExecuting(false);
        return removed;

    }

    const update: ProcessStory = async (theStory): Promise<Story> => {

        const url = STORIES_BASE
            + `/${libraryContext.library.id}/${theStory.id}`;
        let updated = new Story();
        setError(null);
        setExecuting(true);

        try {
            updated = (await Api.put(url, theStory)).data;
            logger.debug({
                context: "useMutateStory.update",
                story: Abridgers.STORY(updated),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateStory.update", anError, {
                story: Abridgers.STORY(theStory),
                url: url,
            }, alertPopup);
        }

        setExecuting(false);
        return updated;

    }

    return {
        error: error,
        executing: executing,
        exclude: exclude,
        include: include,
        insert: insert,
        remove: remove,
        update: update,
    };

}

export default useMutateStory;
