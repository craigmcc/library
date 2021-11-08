// Abridgers -----------------------------------------------------------------

// Return abridged versions of model objects for use in log events.

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from "../models/Library";
import Series from "../models/Series";
import Story from "../models/Story";
import User from "../models/User";
import Volume from "../models/Volume";

// Public Objects ------------------------------------------------------------

export const ANY = (model: Author | Library | Series | Story | User | Volume) => {
    if (model instanceof Author) {
        return AUTHOR(model);
    } else if (model instanceof Library) {
        return LIBRARY(model);
    } else if (model instanceof Series) {
        return SERIES(model);
    } else if (model instanceof Story) {
        return STORY(model);
    } else if (model instanceof User) {
        return USER(model);
    } else if (model instanceof Volume) {
        return VOLUME(model);
    } else {
        return model;
    }
}

export const AUTHOR = (author: Author): object => {
    return {
        id: author.id,
        libraryId: author.libraryId,
        firstName: author.firstName,
        lastName: author.lastName,
        _model: author._model,
    }
}

export const AUTHORS = (authors: Author[]): object[] => {
    const results: object[] = [];
    authors.forEach(author => {
        results.push(AUTHOR(author));
    });
    return results;
}

export const LIBRARY = (library: Library): object => {
    return {
        id: library.id,
        name: library.name,
        _model: library._model,
    }
}

export const LIBRARIES = (libraries: Library[]): object[] => {
    const results: object[] = [];
    libraries.forEach(library => {
        results.push(LIBRARY(library));
    });
    return results;
}

export const SERIES = (series: Series): object => {
    return {
        id: series.id,
        libraryId: series.libraryId,
        name: series.name,
        _model: series._model,
    }
}

export const SERIESES = (serieses: Series[]): object => {
    const results: object[] = [];
    serieses.forEach(series => {
        results.push(SERIES(series));
    });
    return results;
}

export const STORY = (story: Story): object => {
    return {
        id: story.id,
        libraryId: story.libraryId,
        name: story.name,
        _model: story._model,
    }
}

export const STORIES = (stories: Story[]): object[] => {
    const results: object[] = [];
    stories.forEach(story => {
        results.push(STORY(story));
    });
    return results;
}

export const USER = (user: User): object => {
    return {
        id: user.id,
        scope: user.scope,
        username: user.username,
    }
}

export const USERS = (users: User[]): object[] => {
    const results: object[] = [];
    users.forEach(user => {
        results.push(USER(user));
    });
    return results;
}

export const VOLUME = (volume: Volume): object => {
    return {
        id: volume.id,
        libraryId: volume.libraryId,
        name: volume.name,
        _model: volume._model,
    }
}

export const VOLUMES = (volumes: Volume[]): object[] => {
    const results: object[] = [];
    volumes.forEach(volume => {
        results.push(VOLUME(volume));
    });
    return results;
}
