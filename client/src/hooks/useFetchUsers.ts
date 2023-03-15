// useFetchUsers ---------------------------------------------------------

// Custom hook to fetch User objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {Scope} from "../types";
import ApiFetcher from "../fetchers/ApiFetcher";
import LibraryContext from "../components/libraries/LibraryContext";
import LoginContext from "../components/login/LoginContext";
import {LIBRARIES_BASE} from "../models/Library";
import User, {USERS_BASE} from "../models/User";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Users? [false]
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
    currentPage?: number;               // One-relative page number [1]
    pageSize?: number;                  // Number of Users to be returned [25]
    username?: string;                  // Select Users with matching username? [none]
    withAccessTokens?: boolean;         // Include child Access Tokens? [false]
    withRefreshTokens?: boolean;        // Include child Refresh Tokens? [false]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    users: User[];                      // Fetched Users
}

// Hook Details --------------------------------------------------------------

const useFetchUsers = (props: Props): State => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const alertPopup = (props.alertPopup !== undefined) ? props.alertPopup : true;
    const [error, setError] = useState<Error | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        const fetchUsers = async () => {

            setError(null);
            setLoading(true);
            let theUsers: User[] = [];

            const limit = props.pageSize ? props.pageSize : 25;
            const offset = props.currentPage ? (limit * (props.currentPage - 1)) : 0;
            const parameters = {
                active: props.active ? "" : undefined,
                limit: limit,
                offset: offset,
                username: props.username ? props.username : undefined,
                withAccessTokens: props.withAccessTokens ? "" : undefined,
                withRefreshTokens: props.withRefreshTokens ? "" : undefined,
            }


            try {
                if (loginContext.data.loggedIn) {
                    const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
                    const isAdmin = loginContext.validateLibrary(libraryContext.library, Scope.ADMIN);
                    let url = "";
                    if (isSuperuser) {
                        url = `${USERS_BASE}${queryParameters(parameters)}`;
                    } else if (isAdmin) {
                        url = `${LIBRARIES_BASE}/${libraryContext.library.id}/users${queryParameters(parameters)}`;
                    }
                    if (url !== "") {
                        theUsers = ToModel.USERS(await ApiFetcher.get(url));
                        logger.debug({
                            context: "useFetchUsers.fetchUsers",
                            url: url,
                            users: Abridgers.USERS(theUsers),
                        });
                    }
                }
            } catch (anError) {
                setError(anError as Error);
                ReportError("useFetchUsers.fetchUsers", anError, {
                    parameters: parameters,
                }, alertPopup);
            }

            setUsers(theUsers);
            setLoading(false);

        }

        fetchUsers();

    }, [props.active, props.currentPage, props.pageSize,
        props.username, props.withAccessTokens, props.withRefreshTokens,
        alertPopup,
        libraryContext.library,
        loginContext, loginContext.data.loggedIn]);

    return {
        error: error ? error : null,
        loading: loading,
        users: users,
    }

}

export default useFetchUsers;
