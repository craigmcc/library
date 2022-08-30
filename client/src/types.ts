// types ---------------------------------------------------------------------

// Typescript type definitions for client application components.

// External Modules ----------------------------------------------------------

import React from "react";

// Internal Modules ----------------------------------------------------------

import Author from "./models/Author";
import Credentials from "./models/Credentials";
import Library from "./models/Library";
import Series from "./models/Series";
import Story from "./models/Story";
import User from "./models/User";
import Volume from "./models/Volume";

export type Focus = Author | Library | Series | Story | Volume;
export type Parent = Author | Library | Series | Story | Volume;

// API Prefixes --------------------------------------------------------------

export const AUTHOR: string = "Author";
export const LIBRARY: string = "Library";
export const SERIES: string = "Series";
export const STORY: string = "Story";
export const LOGIN: string = "Login";
export const USER: string = "User";
export const VOLUME :string = "Volume";

// Enumerations --------------------------------------------------------------

// Logging levels
export enum Level {
    TRACE = "trace",
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal",
}

// OAuth scopes
export enum Scope {
    ADMIN = "admin",
    ANY = "any",
    REGULAR = "regular",
    SUPERUSER = "superuser",
}

// Stages in multiple-layer management scenarios
export enum Stage {
    // Navigation-only stages
    INITIAL = "initial",
    NEXT = "next",
    PREVIOUS = "previous",
    // Per-model-type stages
    AUTHORS = "Authors",
    SERIES = "Series",
    STORIES = "Stories",
    VOLUMES = "Volumes",
    WRITERS = "Writers",
}

// Login Data ----------------------------------------------------------------

// Data that is visible to HTTP clients not part of the React component hierarchy
export interface LoginData {
    accessToken: string | null;         // Current access token (if logged in)
    alloweds: string[] | null;          // Allowed scope permissions (if logged in)
    expires: Date | null;               // Absolute expiration time (if logged in)
    loggedIn: boolean;                  // Is user currently logged in?
    refreshToken: string | null;        // Current refresh token (if logged in and returned)
    scope: string | null;               // Scope for access token (if logged in)
    username: string | null;            // Logged in username (if logged in)
}

// Params --------------------------------------------------------------------

export interface paginationParams {
    limit?: number;                     // Maximum number of rows to return [no limit]
    offset?: number;                    // Zero-relative offset to first returned row [0]
}

// HTML Event Handlers -------------------------------------------------------

export type OnAction = () => void; // Nothing to pass, just trigger action
export type OnBlur = (event: React.FocusEvent<HTMLElement>) => void;
export type OnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type OnChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => void;
export type OnChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
export type OnClick = (event: React.MouseEvent<HTMLElement>) => void;
export type OnFocus = (event: React.FocusEvent<HTMLElement>) => void;
export type OnKeyDown = (event: React.KeyboardEvent<HTMLElement>) => void;

// Miscellaneous Handlers ----------------------------------------------------

export type HandleAction = () => void; // Synonym for OnAction
export type HandleBoolean = (newBoolean: boolean) => void;
export type HandleDate = (date: string) => void;
export type HandleIndex = (newIndex: number) => void;
export type HandleMonth = (month: string) => void;
export type HandleResults = () => Promise<object>;
export type HandleStage = (stage: Stage) => void;
export type HandleValue = (newValue: string) => void;

// Model Object Handlers -----------------------------------------------------

export type HandleAuthor = (author: Author) => void;
export type HandleCredentials = (credentials: Credentials) => void;
export type HandleLibrary = (library: Library) => void;
export type HandleSeries = (series: Series) => void;
export type HandleStory = (story: Story) => void;
export type HandleUser = (user: User) => void;
export type HandleVolume = (volume: Volume) => void;

export type ProcessAuthor = (author: Author) => Promise<Author>;
export type ProcessLibrary = (library: Library) => Promise<Library>;
export type ProcessSeries = (series: Series) => Promise<Series>;
export type ProcessStory = (story: Story) => Promise<Story>;
export type ProcessUser = (user: User) => Promise<User>;
export type ProcessVolume = (volume: Volume) => Promise<Volume>;

export type ProcessAuthorParent = (author: Author, parent: Parent) => Promise<Author>;
export type ProcessSeriesParent = (series: Series, parent: Parent) => Promise<Series>;
export type ProcessStoryParent = (story: Story, parent: Parent) => Promise<Story>;
export type ProcessVolumeParent = (volume: Volume, parent: Parent) => Promise<Volume>;

