// SavingProgress -----------------------------------------------------------

// Show a "saving" notification when props.saving switches from false to
// true, and unshow it when props.saving switches from true to false.

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
    error?: Error | null;               // Error result (from mutate hook) [no notification]
    executing?: boolean;                // Executing flag (from mutate hook) [no notification]
    message?: string;                   // Message while saving in progress [default value]
    title?: string;                     // Title while saving in progress [no title]
}

// Component Details ---------------------------------------------------------

const DEFAULT_DURATION = 5000;          // Default show duration in ms (0===forever
const DEFAULT_MESSAGE = "Saving in progress";
const ERROR_DURATION = 0;               // Default error show duration in ms (0===forever)

const SavingProgress = (props: Props) => {

    const [errorNotificationId, setErrorNotificationId] = useState<string | null>(null);
    const [executingNotificationId, setExecutingNotificationId] = useState<string | null>(null);

    // Handle error notification
    useEffect(() => {
        logger.trace({
            context: "SavingProgress.useEffect:error",
            error: (props.error !== undefined) ? props.error : "UNDEFINED",
            notificationId: errorNotificationId,
            title: props.title,
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

    // Handle saving notification
    useEffect(() => {
        logger.trace({
            context: "SavingProgress.useEffect:executing",
            executing: (props.executing !== undefined) ? props.executing : "UNDEFINED",
            notificationId: executingNotificationId,
            title: props.title
        });
        if (props.executing !== undefined) {
            if (props.executing && (executingNotificationId === null)) {
                const theNotificationId = store.addNotification({
                    container: "top-right",
                    dismiss: {
                        duration: props.duration ? props.duration : DEFAULT_DURATION,
                    },
                    insert: "bottom",
                    message: props.message ? props.message : DEFAULT_MESSAGE,
                    onRemoval: (id, removedBy) => {
                        setExecutingNotificationId(null); // Assume this was us or the user
                    },
                    title: props.title ? props.title : undefined,
                    type: "info",
                });
                setExecutingNotificationId(theNotificationId);
            } else if (!props.executing && (executingNotificationId !== null)) {
                store.removeNotification(executingNotificationId);
                setExecutingNotificationId(null);
            }
        }
    }, [props.duration, props.executing, props.message, props.title,
        executingNotificationId]);

    return (<div></div>);

}

export default SavingProgress;
