// useMutateVolume ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Volume.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {ProcessVolume, ProcessVolumeParent} from "../types";
import Api from "../clients/Api";
import LibraryContext from "../components/libraries/LibraryContext";
import Author, {AUTHORS_BASE} from "../models/Author";
import Volume, {VOLUMES_BASE} from "../models/Volume";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import {parentBase} from "../util/Transformations";
import Story from "../models/Story";
import {queryParameters} from "../util/QueryParameters";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    exclude: ProcessVolumeParent;       // Function to exclude a Volume from a Parent
    include: ProcessVolumeParent;       // Function to include a Volume with a Parent
    insert: ProcessVolume;              // Function to insert a new Volume
    remove: ProcessVolume;              // Function to remove an existing Volume
    update: ProcessVolume;              // Function to update an existing Volume
}

// Component Details ---------------------------------------------------------

const useMutateVolume = (props: Props): State => {

    const libraryContext = useContext(LibraryContext);

    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateVolume.useEffect",
        });
    });

    const exclude: ProcessVolumeParent = async (theVolume, theParent) => {
        let url: string = "";
        if (theParent instanceof Author) {
            url = AUTHORS_BASE
                + `/${libraryContext.library.id}/${theParent.id}`
                + `${parentBase(theVolume)}/${theVolume.id}`;
        } else if (theParent instanceof Story) {
            url = VOLUMES_BASE
                + `/${libraryContext.library.id}/${theVolume.id}`
                + `${parentBase(theParent)}/${theParent.id})`;
        }
        setError(null);
        setExecuting(true);
        try {
            await Api.delete(url);
            logger.info({
                context: "useMutateVolume.exclude",
                volume: Abridgers.VOLUME(theVolume),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateVolume.exclude", error,{
                volume: Abridgers.VOLUME(theVolume),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        }
        setExecuting(false);
        return theVolume;
    }

    const include: ProcessVolumeParent = async (theVolume, theParent) => {
        let url: string = "";
        if (theParent instanceof Author) {
            const parameters = {
                principal: theParent.principal ? "" : undefined
            }
            url = AUTHORS_BASE
                + `/${libraryContext.library.id}/${theParent.id}`
                + `${parentBase(theVolume)}/${theVolume.id}${queryParameters(parameters)}`;
        } else if (theParent instanceof Story) {
            url = VOLUMES_BASE
                + `/${libraryContext.library.id}/${theVolume.id}`
                + `${parentBase(theParent)}/${theParent.id})`;
        }
        setError(null);
        setExecuting(true);
        try {
            await Api.post(url);
            logger.info({
                context: "useMutateVolume.include",
                volume: Abridgers.VOLUME(theVolume),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateVolume.include", error,{
                volume: Abridgers.VOLUME(theVolume),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        }
        setExecuting(false);
        return theVolume;
    }

    const insert: ProcessVolume = async (theVolume) => {

        let inserted = new Volume();
        setError(null);
        setExecuting(true);

        try {
            inserted = (await Api.post(VOLUMES_BASE
                + `/${libraryContext.library.id}`, theVolume)).data;
            logger.debug({
                context: "useMutateVolume.insert",
                volume: Abridgers.VOLUME(inserted),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateVolume.insert", error, {
                volume: theVolume,
            });
        }

        setExecuting(false);
        return inserted;

    }

    const remove: ProcessVolume = async (theVolume): Promise<Volume> => {

        let removed = new Volume();
        setError(null);
        setExecuting(true);

        try {
            removed = (await Api.delete(VOLUMES_BASE
                + `/${libraryContext.library.id}/${theVolume.id}`)).data;
            logger.debug({
                context: "useMutateVolume.remove",
                volume: Abridgers.VOLUME(removed),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateVolume.remove", error, {
                volume: theVolume,
            });
        }

        setExecuting(false);
        return removed;

    }

    const update: ProcessVolume = async (theVolume): Promise<Volume> => {

        let updated = new Volume();
        setError(null);
        setExecuting(true);

        try {
            updated = (await Api.put(VOLUMES_BASE
                + `/${libraryContext.library.id}/${theVolume.id}`, theVolume)).data;
            logger.debug({
                context: "useMutateVolume.update",
                volume: Abridgers.VOLUME(updated),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateVolume.update", error, {
                volume: theVolume,
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

export default useMutateVolume;
