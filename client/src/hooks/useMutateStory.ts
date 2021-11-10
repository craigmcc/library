// useMutateStory ------------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Story.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {ProcessStory, ProcessStoryParent} from "../types";
import Api from "../clients/Api";
import LibraryContext from "../components/libraries/LibraryContext";
import Story, {STORIES_BASE} from "../models/Story";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import {parentBase} from "../util/Transformations";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
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

const useMutateStory = (props: Props): State => {

    const libraryContext = useContext(LibraryContext);

    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateStory.useEffect",
        });
    });

    const exclude: ProcessStoryParent = async (theStory, theParent) => {
        const url = STORIES_BASE
            + `/${libraryContext.library.id}/${theStory.id}`
            + `${parentBase(theParent)}/${theParent.id}`;
        setError(null);
        setExecuting(true);
        try {
            await Api.delete(url);
            logger.info({
                context: "useMutateStory.exclude",
                author: Abridgers.STORY(theStory),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateStory.exclude", error, {
                author: Abridgers.STORY(theStory),
                parent: Abridgers.ANY(theParent),
                url: url,
            })
        }
        setExecuting(false);
        return theStory;
    }

    const include: ProcessStoryParent = async (theStory, theParent) => {
        const parameters = {
            ordinal: theStory.ordinal ? theStory.ordinal : undefined
        }
        const url = STORIES_BASE
            + `/${libraryContext.library.id}/${theStory.id}`
            + `${parentBase(theParent)}/${theParent.id}${queryParameters(parameters)}`;
        setError(null);
        setExecuting(true);
        try {
            await Api.post(url);
            logger.info({
                context: "useMutateStory.include",
                author: Abridgers.STORY(theStory),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateStory.include", error, {
                author: Abridgers.STORY(theStory),
                parent: Abridgers.ANY(theParent),
                url: url,
            })
        }
        setExecuting(false);
        return theStory;
    }

    const insert: ProcessStory = async (theStory) => {

        let inserted = new Story();
        setError(null);
        setExecuting(true);

        try {
            inserted = (await Api.post(STORIES_BASE
                + `/${libraryContext.library.id}`, theStory)).data;
            logger.debug({
                context: "useMutateStory.insert",
                volume: Abridgers.STORY(inserted),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateStory.insert", error, {
                volume: theStory,
            });
        }

        setExecuting(false);
        return inserted;

    }

    const remove: ProcessStory = async (theStory): Promise<Story> => {

        let removed = new Story();
        setError(null);
        setExecuting(true);

        try {
            removed = (await Api.delete(STORIES_BASE
                + `/${libraryContext.library.id}/${theStory.id}`)).data;
            logger.debug({
                context: "useMutateStory.remove",
                volume: Abridgers.STORY(removed),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateStory.remove", error, {
                volume: theStory,
            });
        }

        setExecuting(false);
        return removed;

    }

    const update: ProcessStory = async (theStory): Promise<Story> => {

        let updated = new Story();
        setError(null);
        setExecuting(true);

        try {
            updated = (await Api.put(STORIES_BASE
                + `/${libraryContext.library.id}/${theStory.id}`, theStory)).data;
            logger.debug({
                context: "useMutateStory.update",
                volume: Abridgers.STORY(updated),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateStory.update", error, {
                volume: theStory,
            });
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
