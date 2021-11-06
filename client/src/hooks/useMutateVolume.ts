// useMutateVolume ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Volume.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleVolume} from "../types";
import Api from "../clients/Api";
import LibraryContext from "../components/libraries/LibraryContext";
import Volume, {VOLUMES_BASE} from "../models/Volume";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: HandleVolume;               // Function to insert a new Volume
    remove: HandleVolume;               // Function to remove an existing Volume
    update: HandleVolume;               // Function to update an existing Volume
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

    const insert: HandleVolume = async (theVolume): Promise<Volume> => {

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

    const remove: HandleVolume = async (theVolume): Promise<Volume> => {

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

    const update: HandleVolume = async (theVolume): Promise<Volume> => {

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
        insert: insert,
        remove: remove,
        update: update,
    };

}

export default useMutateVolume;
