// application-validators ----------------------------------------------------

// Custom (to this application) validation methods that can be used by both
// backend database interactions and frontend UI components.  In all cases,
// a "true" return indicates that the proposed value is valid, while "false"
// means it is not.  If a field is required, that must be validated separately.

// External Modules ----------------------------------------------------------

import validator from "validator";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export const validateEmail = (email: string): boolean => {
    if (email) {
        return validator.isEmail(email);
    } else {
        return true;
    }
}

export const validateISBN = (isbn: string): boolean => {
    if (isbn) {
        return validator.isISBN(isbn);
    } else {
        return true;
    }
}

export const validateLevel = (level: string): boolean => {
    if (level) {
        return validator.isIn(level, validLevels);
    } else {
        return true;
    }
}

export const validateMedia = (media: string): boolean => {
    if (media) {
        return validator.isIn(media, validMedias);
    } else {
        return true;
    }
}

// Private Objects -----------------------------------------------------------

export const validLevels: string[] = [
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal",
];

export const validMedias = [
    "Book",      // Physical book
    "Kindle",    // Downloaded to Kindle app as purchased
    "Kobo",      // Downloaded to Kobo app
    "PDF",       // Downloaded as a PDF
    "Returned",  // Returned to Kindle Unlimited but available to reload
    "Unlimited", // Downloaded to Kindle app as Unlimited
    "Unknown",   // Unknown media type
    "Watch",     // Not yet purchased or downloaded
];

