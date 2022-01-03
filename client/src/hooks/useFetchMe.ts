// useFetchMe ----------------------------------------------------------------

// Custom hook to fetch the "me" resource, which will be the User for the
// authenticated access token the user is logged in with.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleAction} from "../types";
import OAuth from "../clients/OAuth";
import LoginContext from "../components/login/LoginContext";
import User from "../models/User";
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
    loading: boolean;                   // Are we currently loading?
    me: User;                           // User for authenticated login
    refresh: HandleAction;              // Callback to trigger a refresh
}

// Hook Details --------------------------------------------------------------

const useFetchMe = (props: Props = {}): State => {

    const loginContext = useContext(LoginContext);

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [me, setMe] = useState<User>(new User());
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {

        let theMe = new User();
        setError(null);
        setLoading(true);

        const fetchMe = async () => {
            const url = "/me";
            try {
                theMe = ToModel.USER((await OAuth.get(url)).data);
                if (!theMe.googleBooksApiKey) {
                    theMe.googleBooksApiKey = "";
                }
            } catch (anError) {
                setError(anError as Error);
                ReportError("useFetchMe.fetchMe", anError, {
                    loggedIn: loginContext.data.loggedIn,
                    refresh: refresh,
                    url: url,
                }, alertPopup);
            }
            setMe(theMe);
        }

        if (loginContext.data.loggedIn) {
            fetchMe();
        } else {
            setMe(new User({
                googleBooksApiKey: "",
            }));
        }

        logger.debug({
            context: "useFetchMe.useEffect",
            loggedIn: loginContext.data.loggedIn,
            me: Abridgers.USER(theMe),
            refresh: refresh,
        })

        setLoading(false);
        setRefresh(false);

    }, [alertPopup, refresh, loginContext.data.loggedIn]);

    const handleRefresh: HandleAction = () => {
        logger.debug({
            context: "useFetchMe.handleRefresh",
        });
        setRefresh(true);
    }

    return {
        error: error ? error : null,
        loading: loading,
        me: me,
        refresh: handleRefresh,
    }

}

export default useFetchMe;
