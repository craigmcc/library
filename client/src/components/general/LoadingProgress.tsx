// LoadingProgress -----------------------------------------------------------

// Show a "loading" notification when props.loading switches from false to
// true, and unshow it when props.loading switches from true to false.

// Show an "error" notification when props.error switches from null to
// non-null, and unshow it when props.error switches from non-null to null.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import {store} from "react-notifications-component";

// Internal Modules ----------------------------------------------------------

import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    duration?: number;                  // Show duration in ms (0=forever) [default value]
    error?: Error | null;               // Error result (from fetch hook) [no notification]
    loading?: boolean;                  // Loading flag (from fetch hook) [no notification]
    message?: string;                   // Message while loading in progress [default value]
    title?: string;                     // Title while loading in progress [no title]
}

// Component Details ---------------------------------------------------------

const DEFAULT_DURATION = 5000;          // Default show duration in ms (0===forever
const DEFAULT_MESSAGE = "Loading in progress";
const ERROR_DURATION = 0;               // Default error show duration in ms (0===forever)

const LoadingProgress = (props: Props) => {

    const [errorNotificationId, setErrorNotificationId] = useState<string | null>(null);
    const [loadingNotificationId, setLoadingNotificationId] = useState<string | null>(null);

    // Handle error notification
    useEffect(() => {
        logger.trace({
            context: "LoadingProgress.useEffect:error",
            error: (props.error !== undefined) ? props.error : "UNDEFINED",
            notificationId: errorNotificationId,
        });
        if (props.error !== undefined) {
            if (props.error && (errorNotificationId === null)) {
                const theNotificationId = store.addNotification({
                    container: "top-right",
                    dismiss: {
                        duration: ERROR_DURATION,
                    },
                    insert: "bottom",
                    message: props.error.message,
                    onRemoval: (id, removedBy) => {
                        setErrorNotificationId(null); // Assume this was us or the user
                    },
                    title: props.title ? props.title : undefined,
                    type: "danger",
                });
                setErrorNotificationId(theNotificationId);
            } else if (!props.error && (errorNotificationId !== null)) {
                store.removeNotification(errorNotificationId);
                setErrorNotificationId(null);
            }
        }
    }, [props.error, props.title,
        errorNotificationId]);

    // Handle loading notification
    useEffect(() => {
        logger.trace({
            context: "LoadingProgress.useEffect:loading",
            loading: (props.loading !== undefined) ? props.loading : "UNDEFINED",
            notificationId: loadingNotificationId,
        });
        if (props.loading !== undefined) {
            if (props.loading && (loadingNotificationId === null)) {
                const theNotificationId = store.addNotification({
                    container: "top-right",
                    dismiss: {
                        duration: props.duration ? props.duration : DEFAULT_DURATION,
                    },
                    insert: "bottom",
                    message: props.message ? props.message : DEFAULT_MESSAGE,
                    onRemoval: (id, removedBy) => {
                        setLoadingNotificationId(null); // Assume this was us or the user
                    },
                    title: props.title ? props.title : undefined,
                    type: "info",
                });
                setLoadingNotificationId(theNotificationId);
            } else if (!props.loading && (loadingNotificationId !== null)) {
                store.removeNotification(loadingNotificationId);
                setLoadingNotificationId(null);
            }
        }
    }, [props.duration, props.loading, props.message, props.title,
        loadingNotificationId]);

    return (<div></div>);

}

export default LoadingProgress;
