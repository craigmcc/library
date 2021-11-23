// Notifications -------------------------------------------------------------

// Factory for notification options (with custom messages).

// External Modules ----------------------------------------------------------

import {ReactNotificationOptions} from "react-notifications-component";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

const ERROR_DURATION = 0; // Milliseconds (0 means never fades away)
const SUCCESS_DURATION = 5000; // Milliseconds

export const errorNotification = (title: string, error: Error): ReactNotificationOptions => {
    return {
        container: "top-right",
        dismiss: {
            duration: ERROR_DURATION,
        },
        insert: "top",
        message: error.message,
        title: title,
        type: "danger",
    }
}

export const insertedNotification = (title: string, message?: string): ReactNotificationOptions => {
    return {
        container: "top-right",
        dismiss: {
            duration: SUCCESS_DURATION,
        },
        insert: "bottom",
        message: message ? message : `Successfully inserted`,
        title: title,
        type: "success",
    }
}

export const removedNotification = (title: string, message?: string): ReactNotificationOptions => {
    return {
        container: "top-right",
        dismiss: {
            duration: SUCCESS_DURATION,
        },
        insert: "bottom",
        message: message ? message : `Successfully removed`,
        title: title,
        type: "success",
    }
}

export const updatedNotification = (title: string, message?: string): ReactNotificationOptions => {
    return {
        container: "top-right",
        dismiss: {
            duration: SUCCESS_DURATION,
        },
        insert: "bottom",
        message: message ? message : `Successfully updated`,
        title: title,
        type: "success",
    }
}

