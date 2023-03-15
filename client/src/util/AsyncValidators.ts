// AsyncValidators -----------------------------------------------------------

// Custom (to this application) validation methods that must interact with
// the server asynchronously to perform their validations.  In all cases,
// a "true" return value indicates that the proposed value is valid, while
// "false" means it is not.  If a field is required, that must be validated
// separately.

// The methods defined here should correspond (in name and parameters) to
// the similar ones in the server side AsynchValidators set, because they
// perform the same semantic functions.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import ApiFetcher from "../fetchers/ApiFetcher";
import Author, {AUTHORS_BASE} from "../models/Author";
import Library, {LIBRARIES_BASE} from "../models/Library";
import Series, {SERIES_BASE} from "../models/Series";
import Story, {STORIES_BASE} from "../models/Story";
import User, {USERS_BASE} from "../models/User";
import Volume, {VOLUMES_BASE} from "../models/Volume";
import {queryParameters} from "./QueryParameters";

// Public Objects ------------------------------------------------------------

export const validateAuthorNameUnique = async (author: Author): Promise<boolean> => {
    if (author && author.firstName && author.lastName) {
        try {
            const result = await ApiFetcher.get(AUTHORS_BASE
                + `/${author.libraryId}/exact/${author.firstName}/${author.lastName}`);
            return (result.id === author.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateLibraryNameUnique = async (library: Library): Promise<boolean> => {
    if (library && library.name) {
        try {
            const result = await ApiFetcher.get(LIBRARIES_BASE
                + `/exact/${library.name}`);
            return (result.id === library.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateLibraryScopeUnique = async (library: Library): Promise<boolean> => {
    if (library && library.scope) {
        try {
            const parameters = {
                scope: library.scope,
            }
            const results = await ApiFetcher.get(LIBRARIES_BASE
                + `${queryParameters(parameters)}`);
            return (results.length === 0) || (results[0].id === library.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateSeriesNameUnique = async (series: Series): Promise<boolean> => {
    if (series && series.name) {
        try {
            const result = await ApiFetcher.get(SERIES_BASE
                + `/${series.libraryId}/exact/${series.name}`);
            return (result.id === series.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateStoryNameUnique = async (story: Story): Promise<boolean> => {
    if (story && story.name) {
        try {
            const result = await ApiFetcher.get(STORIES_BASE
                + `/${story.libraryId}/exact/${story.name}`);
            return (result.id === story.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateUserUsernameUnique = async (user: User): Promise<boolean> => {
    if (user && user.username) {
        try {
            const result = await ApiFetcher.get(USERS_BASE
                + `/exact/${user.username}`);
            return (result.id === user.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateUserUsernameLibraryUnique = async (user: User, library: Library): Promise<boolean> => {
    if (user && user.username) {
        try {
            const result = await ApiFetcher.get(LIBRARIES_BASE
                + `/${library.id}/users/exact/${user.username}`);
            return (result.id === user.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateVolumeNameUnique = async (volume: Volume): Promise<boolean> => {
    if (volume && volume.name) {
        try {
            const result = await ApiFetcher.get(VOLUMES_BASE
                + `/${volume.libraryId}/exact/${volume.name}`);
            return (result.id === volume.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

