// useMutateLibrary ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Library.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {ProcessLibrary} from "../types";
import ApiFetcher from "../fetchers/ApiFetcher";
import Library, {LIBRARIES_BASE} from "../models/Library";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: ProcessLibrary;             // Function to insert a new Library
    remove: ProcessLibrary;             // Function to remove an existing Library
    update: ProcessLibrary;             // Function to update an existing Library
}

// Component Details ---------------------------------------------------------

const useMutateLibrary = (props: Props = {}): State => {

    const alertPopup = (props.alertPopup !== undefined) ? props.alertPopup : true;
    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateLibrary.useEffect",
        });
    });

    const insert: ProcessLibrary = async (theLibrary) => {

        const url = LIBRARIES_BASE;
        let inserted = new Library();
        setError(null);
        setExecuting(true);

        try {
            inserted = ToModel.LIBRARY(await ApiFetcher.post(url, theLibrary));
            logger.debug({
                context: "useMutateLibrary.insert",
                library: Abridgers.LIBRARY(inserted),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateLibrary.insert", anError, {
                library: theLibrary,
                url: url,
            }, alertPopup);
        }

        setExecuting(false);
        return inserted;

    }

    const remove: ProcessLibrary = async (theLibrary) => {

        const url = LIBRARIES_BASE
            + `/${theLibrary.id}`;
        let removed = new Library();
        setError(null);
        setExecuting(true);

        try {
            removed = ToModel.LIBRARY(await ApiFetcher.delete(url));
            logger.debug({
                context: "useMutateLibrary.remove",
                library: Abridgers.LIBRARY(removed),
                url: url,
            });
        } catch (enError) {
            setError(enError as Error);
            ReportError("useMutateLibrary.remove", enError, {
                library: theLibrary,
                url: url,
            }, alertPopup);
        }

        setExecuting(false);
        return removed;

    }

    const update: ProcessLibrary = async (theLibrary) => {

        const url = LIBRARIES_BASE
            + `/${theLibrary.id}`
        let updated = new Library();
        setError(null);
        setExecuting(true);

        try {
            updated = ToModel.LIBRARY(await ApiFetcher.put(url, theLibrary));
            logger.debug({
                context: "useMutateLibrary.update",
                library: Abridgers.LIBRARY(updated),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateLibrary.update", anError, {
                library: Abridgers.LIBRARY(theLibrary),
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
