// types.d.ts

/**
 * Fundamental data types and constants for the Library application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Models -----------------------------------------------------------

import {
    Library,
    User,
} from "./models";

// Enumerations --------------------------------------------------------------

/**
 * Logging levels.
 */
declare enum Level {
    TRACE = "trace",
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal",
}

/**
 * OAuth scopes.
 */
declare enum Scope {
    ADMIN = "admin",
    ANY = "any",
    REGULAR = "regular",
    SUPERUSER = "superuser",
}

// Login Data ----------------------------------------------------------------

/**
 * Data that is visible to HTTP clients that are not part of the React
 * component hierarchy.  These values MUST be JSON serializable.
 */
interface LoginData {
    accessToken: string | null;         // Current access token (if logged in)
    alloweds: string[] | null;          // Allowed scope permissions (if logged in)
    expires: Date | null;               // Absolute expiration time (if logged in)
    loggedIn: boolean;                  // Is user currently logged in?
    refreshToken: string | null;        // Current refresh token (if logged in and returned)
    scope: string | null;               // Scope for access token (if logged in)
    username: string | null;            // Logged in username (if logged in)
}

// Event Handlers ------------------------------------------------------------

/**
 * Handler functions for HTML events, useful in specifying component properties.
 */
type OnAction = () => void; // Nothing to pass, just trigger action
type OnBlur = (event: React.FocusEvent<HTMLElement>) => void;
type OnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => void;
type OnChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => void;
type OnChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
type OnClick = (event: React.MouseEvent<HTMLElement>) => void;
type OnFocus = (event: React.FocusEvent<HTMLElement>) => void;
type OnKeyDown = (event: React.KeyboardEvent<HTMLElement>) => void;

/**
 * Handler functions for events that take a specific type of data,
 * useful in specifying component properties.
 */
type HandleAction = () => void; // Synonym for OnAction
type HandleBoolean = (newBoolean: boolean) => void;
type HandleDate = (date: string) => void;
type HandleIndex = (newIndex: number) => void;
type HandleMonth = (month: string) => void;
type HandleResults = () => Promise<object>;
//type HandleStage = (stage: Stage) => void;
type HandleValue = (newValue: string) => void;

/**
 * Handler functions for synchronous events that accept a Model object
 * but void.
 */
type HandleLibrary = (libray: Library) => void;
type HandleUser = (user: User) => void;

/**
 * Handler functions for asynchronous events that accept a Model object
 * and return a Promise for the same Model object type.
 */
type ProcessLibrary = (library: Library) => Promise<Library>;
type ProcessUser = (user: User) => Promise<User>;

