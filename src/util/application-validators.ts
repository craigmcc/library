// application-validators ----------------------------------------------------

// Custom (to this application) validation methods that can be used by both
// backend database interactions and frontend UI components.  In all cases,
// a "true" return indicates that the proposed value is valid, while "false"
// means it is not.  If a field is required, that must be validated separately.

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export const validateLevel = (level: string): boolean => {
    if (level) {
        return validLevels.includes(level);
    } else {
        return true;
    }
}

// Private Objects -----------------------------------------------------------

const validLevels: string[] =
    [ "debug", "error", "fatal", "info", "trace", "warn" ];

