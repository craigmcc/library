// useMutateUser ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a User.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleUser} from "../types";
import Api from "../clients/Api";
import User, {USERS_BASE} from "../models/User";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: HandleUser;                 // Function to insert a new User
    remove: HandleUser;                 // Function to remove an existing User
    update: HandleUser;                 // Function to update an existing User
}

// Component Details ---------------------------------------------------------

const useMutateUser = (props: Props): State => {

    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateUser.useEffect",
        });
    });

    const insert: HandleUser = async (theUser): Promise<User> => {

        let inserted = new User();
        setError(null);
        setExecuting(true);

        try {
            inserted = (await Api.post(USERS_BASE, theUser)).data;
            logger.debug({
                context: "useMutateUser.insert",
                library: Abridgers.USER(inserted),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateUser.insert", error, {
                library: theUser,
            });
        }

        setExecuting(false);
        return inserted;

    }

    const remove: HandleUser = async (theUser): Promise<User> => {

        let removed = new User();
        setError(null);
        setExecuting(true);

        try {
            removed = (await Api.delete(USERS_BASE
                + `/${theUser.id}`)).data;
            logger.debug({
                context: "useMutateUser.remove",
                library: Abridgers.USER(removed),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateFcility.remove", error, {
                library: theUser,
            });
        }

        setExecuting(false);
        return removed;

    }

    const update: HandleUser = async (theUser): Promise<User> => {

        let updated = new User();
        setError(null);
        setExecuting(true);

        try {
            updated = (await Api.put(USERS_BASE
                + `/${theUser.id}`, theUser)).data;
            logger.debug({
                context: "useMutateUser.update",
                library: Abridgers.USER(updated),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateUser.update", error, {
                library: theUser,
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

export default useMutateUser;
