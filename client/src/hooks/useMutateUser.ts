// useMutateUser ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a User.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {ProcessUser, Scope} from "../types";
import ApiFetcher from "../fetchers/ApiFetcher";
import LibraryContext from "../components/libraries/LibraryContext";
import LoginContext from "../components/login/LoginContext";
import User, {USERS_BASE} from "../models/User";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";
import {LIBRARIES_BASE} from "../models/Library";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: ProcessUser;                // Function to insert a new User
    remove: ProcessUser;                // Function to remove an existing User
    update: ProcessUser;                // Function to update an existing User
}

// Component Details ---------------------------------------------------------

const useMutateUser = (props: Props = {}): State => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const alertPopup = (props.alertPopup !== undefined) ? props.alertPopup : true;
    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateUser.useEffect",
        });
    });

    const insert: ProcessUser = async (theUser) => {

        const isAdmin =
            loginContext.validateLibrary(libraryContext.library, Scope.ADMIN);
        const url = isAdmin
          ? `${LIBRARIES_BASE}/${libraryContext.library.id}/users`
          : USERS_BASE;
        let inserted = new User();
        setError(null);
        setExecuting(true);

        try {
            inserted = ToModel.USER(await ApiFetcher.post(url, theUser));
            logger.debug({
                context: "useMutateUser.insert",
                user: Abridgers.USER(inserted),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateUser.insert", anError, {
                user: Abridgers.USER(theUser),
                url: url,
            }, alertPopup);
        }

        setExecuting(false);
        return inserted;

    }

    const remove: ProcessUser = async (theUser) => {

        const isAdmin =
            loginContext.validateLibrary(libraryContext.library, Scope.ADMIN);
        const url = isAdmin
            ? `${LIBRARIES_BASE}/${libraryContext.library.id}/users/${theUser.id}`
            : `${USERS_BASE}/${theUser.id}`;

        let removed = new User();
        setError(null);
        setExecuting(true);

        try {
            removed = ToModel.USER(await ApiFetcher.delete(url));
            logger.debug({
                context: "useMutateUser.remove",
                user: Abridgers.USER(removed),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateFcility.remove", anError, {
                user: ToModel.USER(theUser),
                url: url,
            }, alertPopup);
        }

        setExecuting(false);
        return removed;

    }

    const update: ProcessUser = async (theUser) => {

        const isAdmin =
            loginContext.validateLibrary(libraryContext.library, Scope.ADMIN);
        const url = isAdmin
            ? `${LIBRARIES_BASE}/${libraryContext.library.id}/users/${theUser.id}`
            : `${USERS_BASE}/${theUser.id}`;

        let updated = new User();
        setError(null);
        setExecuting(true);

        try {
            updated = ToModel.USER(await ApiFetcher.put(url, theUser));
            logger.debug({
                context: "useMutateUser.update",
                user: Abridgers.USER(updated),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateUser.update", anError, {
                user: Abridgers.USER(theUser),
                url: url,
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

export default useMutateUser;
