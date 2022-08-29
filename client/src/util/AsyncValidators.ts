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

import Store from "../Store";
import Api from "../clients/Api";
import {
    allLibraries,
    allLibrariesParams,
    exactLibrary,
    exactLibraryParams,
} from "../components/libraries/LibrarySlice";
import {
    exactUser,
    exactUserParams
} from "../components/users/UserSlice";
import Author, {AUTHORS_BASE} from "../models/Author";
import Library from "../models/Library";
import Series, {SERIES_BASE} from "../models/Series";
import Story, {STORIES_BASE} from "../models/Story";
import User from "../models/User";
import Volume, {VOLUMES_BASE} from "../models/Volume";

const dispatch = Store.dispatch;

// Public Objects ------------------------------------------------------------

export const validateAuthorNameUnique = async (author: Author): Promise<boolean> => {
    if (author && author.firstName && author.lastName) {
        try {
            const result = (await Api.get(AUTHORS_BASE
                + `/${author.libraryId}/exact/${author.firstName}/${author.lastName}`)).data;
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
        const params: exactLibraryParams = {
            name: library.name,
        }
        const result = await dispatch(exactLibrary(params));
        const answer = result.payload;
        if (answer instanceof Library) {
            return (answer.id === library.id);
        } else {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateLibraryScopeUnique = async (library: Library): Promise<boolean> => {
    if (library && library.scope) {
        const params: allLibrariesParams = {
            scope: library.scope,
        }
        const result = await dispatch(allLibraries(params));
        const answer = result.payload;
        if (Array.isArray(answer)) {
            if (answer.length === 0) {
                return true;
            } else {
                return answer[0].id === library.id;
            }
        } else {
            return true; // Definitely unique
        }
/*
        try {
            const parameters = {
                scope: library.scope,
            }
            const results = (await Api.get(LIBRARIES_BASE
                + `${queryParameters(parameters)}`)).data;
            return (results.length === 0) || (results[0].id === library.id);
        } catch (error) {
            return true; // Definitely unique
        }
*/
    } else {
        return true;
    }
}

export const validateSeriesNameUnique = async (series: Series): Promise<boolean> => {
    if (series && series.name) {
        try {
            const result = (await Api.get(SERIES_BASE
                + `/${series.libraryId}/exact/${series.name}`)).data;
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
            const result = (await Api.get(STORIES_BASE
                + `/${story.libraryId}/exact/${story.name}`)).data;
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
        const params: exactUserParams = {
            username: user.username,
        }
        const result = await dispatch(exactUser(params));
        const answer = result.payload;
        if (answer instanceof User) {
            return (answer.id === user.id);
        } else {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateVolumeNameUnique = async (volume: Volume): Promise<boolean> => {
    if (volume && volume.name) {
        try {
            const result = (await Api.get(VOLUMES_BASE
                + `/${volume.libraryId}/exact/${volume.name}`)).data;
            return (result.id === volume.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

