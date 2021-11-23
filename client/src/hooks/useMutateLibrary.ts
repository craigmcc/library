// useMutateLibrary ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Library.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleLibrary} from "../types";
import Api from "../clients/Api";
import Library, {LIBRARIES_BASE} from "../models/Library";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: HandleLibrary;              // Function to insert a new Library
    remove: HandleLibrary;              // Function to remove an existing Library
    update: HandleLibrary;              // Function to update an existing Library
}

// Component Details ---------------------------------------------------------

const useMutateLibrary = (props: Props): State => {

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateLibrary.useEffect",
        });
    });

    const insert: HandleLibrary = async (theLibrary): Promise<Library> => {

        let inserted = new Library();
        setError(null);
        setExecuting(true);

        try {
            inserted = (await Api.post(LIBRARIES_BASE, theLibrary)).data;
            logger.debug({
                context: "useMutateLibrary.insert",
                library: Abridgers.LIBRARY(inserted),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateLibrary.insert", error, {
                library: theLibrary,
            }, alertPopup);
        }

        setExecuting(false);
        return inserted;

    }

    const remove: HandleLibrary = async (theLibrary): Promise<Library> => {

        let removed = new Library();
        setError(null);
        setExecuting(true);

        try {
            removed = (await Api.delete(LIBRARIES_BASE
                + `/${theLibrary.id}`)).data;
            logger.debug({
                context: "useMutateLibrary.remove",
                library: Abridgers.LIBRARY(removed),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateLibrary.remove", error, {
                library: theLibrary,
            }, alertPopup);
        }

        setExecuting(false);
        return removed;

    }

    const update: HandleLibrary = async (theLibrary): Promise<Library> => {

        let updated = new Library();
        setError(null);
        setExecuting(true);

        try {
            updated = (await Api.put(LIBRARIES_BASE
                + `/${theLibrary.id}`, theLibrary)).data;
            logger.debug({
                context: "useMutateLibrary.update",
                library: Abridgers.LIBRARY(updated),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateLibrary.update", error, {
                library: theLibrary,
            }, alertPopup);
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

export default useMutateLibrary;
