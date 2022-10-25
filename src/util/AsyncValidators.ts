/**
 * Custom (to this application) validation methods that can only be used by
 * server side applications, because they interact directly with the database.
 * A "true" return indicates that the specified value is valid, while a
 * "false" return indicates that it is not.  If a field is required, that must
 * be validated separately.
 * @packageDocumentation
 */

// AsyncValidators -----------------------------------------------------------

// External Modules ----------------------------------------------------------

import {Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import Author from "../models/Author";
import Library from "../models/Library";
import RefreshToken from "../models/RefreshToken";
import Series from "../models/Series";
import Story from "../models/Story";
import User from "../models/User";
import Volume from "../models/Volume";

// Public Objects ------------------------------------------------------------

/**
 * Validate that this AccessToken's token is globally unique.
 * @param accessToken                   The {@link models/AccessToken | AccessToken} to validate
 */
export const validateAccessTokenTokenUnique
    = async (accessToken: AccessToken): Promise<boolean> =>
{
    if (accessToken && accessToken.token) {
        let options: any = {
            where: {
                token: accessToken.token,
            }
        }
        if (accessToken.id && (accessToken.id > 0)) {
            options.where.id = { [Op.ne]: accessToken.id }
        }
        const results = await AccessToken.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

/**
 * Validate that this Author's name is unique within its owning Library
 * @param author                        The Author whose name should be validated
 */
export const validateAuthorNameUnique
    = async (author: Author): Promise<boolean> =>
{
    if (author && author.firstName && author.lastName) {
        let options: any = {
            where: {
                firstName: author.firstName,
                lastName: author.lastName,
                libraryId: author.libraryId,
            }
        }
        if (author.id) {
            options.where.id = { [Op.ne]: author.id }
        }
        const results: Author[] = await Author.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

/**
 * Validate that the specified ID is a valid Library ID.
 * @param libraryId                     The Library ID to be validated
 */
export const validateLibraryId = async (libraryId: number): Promise<boolean> => {
    if (libraryId) {
        const library = Library.findByPk(libraryId);
        return (library !== null);
    } else {
        return true;
    }
}

/**
 * Validate that the name of this Library is globally unique.
 * @param library                       The Library whose name is to be validated
 */
export const validateLibraryNameUnique
    = async (library: Library): Promise<boolean> =>
{
    if (library && library.name) {
        let options = {};
        if (library.id && (library.id > 0)) {
            options = {
                where: {
                    id: {[Op.ne]: library.id},
                    name: library.name
                }
            }
        } else {
            options = {
                where: {
                    name: library.name
                }
            }
        }
        let results = await Library.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

/**
 * Validate that the scope of this Library is globally unique.
 * @param library                       The Library whose scope is to be validated
 */
export const validateLibraryScopeUnique
    = async (library: Library): Promise<boolean> =>
{
    if (library && library.scope) {
        let options = {};
        if (library.id && (library.id > 0)) {
            options = {
                where: {
                    id: {[Op.ne]: library.id},
                    scope: library.scope
                }
            }
        } else {
            options = {
                where: {
                    scope: library.scope
                }
            }
        }
        let results = await Library.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

/**
 * Validate that this RefreshToken's token is globally unique.
 * @param refreshToken                  The {@link models/RefreshToken | RefreshToken} to validate
 */
export const validateRefreshTokenTokenUnique
    = async (refreshToken: RefreshToken): Promise<boolean> =>
{
    if (refreshToken && refreshToken.token) {
        let options: any = {
            where: {
                token: refreshToken.token,
            }
        }
        if (refreshToken.id && (refreshToken.id > 0)) {
            options.where.id = { [Op.ne]: refreshToken.id }
        }
        const results = await RefreshToken.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

/**
 * Validate that the name of this Series is unique within its owning Library.
 * @param series                        The Series whose name is to be validated
 */
export const validateSeriesNameUnique
    = async (series: Series): Promise<boolean> =>
{
    if (series && series.libraryId && series.name) {
        let options = {};
        if (series.id && (series.id > 0)) {
            options = {
                where: {
                    id: {[Op.ne]: series.id},
                    libraryId: series.libraryId,
                    name: series.name
                }
            }
        } else {
            options = {
                where: {
                    libraryId: series.libraryId,
                    name: series.name
                }
            }
        }
        let results = await Series.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

/**
 * Validate that the name of this Story is unique within its owning Library.
 * @param story                         The Story whose name is to be validated
 */
export const validateStoryNameUnique
    = async (story: Story): Promise<boolean> =>
{
    if (story && story.libraryId && story.name) {
        let options = {};
        if (story.id && (story.id > 0)) {
            options = {
                where: {
                    id: {[Op.ne]: story.id},
                    libraryId: story.libraryId,
                    name: story.name
                }
            }
        } else {
            options = {
                where: {
                    libraryId: story.libraryId,
                    name: story.name
                }
            }
        }
        let results = await Story.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

/**
 * Validate that the username of this User is globally unique.
 * @param user                          The User whose name is to be validated
 */
export const validateUserUsernameUnique
    = async (user: User): Promise<boolean> =>
{
    if (user && user.username) {
        let options = {};
        if (user.id && (user.id > 0)) {
            options = {
                where: {
                    id: {[Op.ne]: user.id},
                    username: user.username
                }
            }
        } else {
            options = {
                where: {
                    username: user.username
                }
            }
        }
        let results = await User.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

/**
 * Validate that the name of this Volume is unique within its owning Library.
 * @param volume                        The Volume whose name is to be validated
 */
export const validateVolumeNameUnique
    = async (volume: Volume): Promise<boolean> =>
{
    if (volume && volume.libraryId && volume.name) {
        let options = {};
        if (volume.id && (volume.id > 0)) {
            options = {
                where: {
                    id: {[Op.ne]: volume.id},
                    libraryId: volume.libraryId,
                    name: volume.name
                }
            }
        } else {
            options = {
                where: {
                    libraryId: volume.libraryId,
                    name: volume.name
                }
            }
        }
        let results = await Volume.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}
