// async-validators ----------------------------------------------------------

// Custom (to this application) validation methods that can only be used by
// server side applications, because they interact directly with the database.
// In all cases, a "true" return indicates that the proposed value is valid,
// while "false" means it is not.  If a field is required, that must be
// validated separately.

// External Modules ----------------------------------------------------------

import Volume from "../models/Volume";

const { Op } = require("sequelize");

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import Author from "../models/Author";
import Library from "../models/Library";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const validateAccessTokenUnique
    = async (accessToken: AccessToken): Promise<boolean> =>
{
    if (accessToken) {
        let options: any = {
            where: {
                token: accessToken.token,
            }
        }
        if (accessToken.id && (accessToken.id > 0)) {
            options.where.id = { [Op.ne]: accessToken.id }
        }
        const result = await AccessToken.findOne(options);
        return (!result);
    } else {
        return true;
    }
}

export const validateAuthorId = async (authorId: number): Promise<boolean> => {
    if (authorId) {
        const author = await Author.findByPk(authorId);
        return (author !== null);
    } else {
        return true;
    }
}

export const validateAuthorNameUnique
    = async (author: Author): Promise<boolean> =>
{
    if (author) {
        let options: any = {
            where: {
                firstName: author.firstName,
                lastName: author.lastName,
            }
        }
        if (author.id && (author.id > 0)) {
            options.where.id = { [Op.ne]: author.id }
        }
        const result = await Author.findOne(options);
        return (!result);
    } else {
        return true;
    }
}

export const validateLibraryId = async (libraryId: number): Promise<boolean> => {
    if (libraryId) {
        const library = await Library.findByPk(libraryId);
        return (library !== null);
    } else {
        return true;
    }
}

export const validateLibraryNameUnique
    = async (library: Library): Promise<boolean> =>
{
    if (library) {
        let options: any = {
            where: {
                name: library.name,
            }
        }
        if (library.id && (library.id > 0)) {
            options.where.id = { [Op.ne]: library.id }
        }
        const result = await Author.findOne(options);
        return (!result);
    } else {
        return true;
    }
}

export const validateLibraryScopeUnique
    = async (library: Library): Promise<boolean> =>
{
    if (library) {
        let options: any = {
            where: {
                scope: library.scope,
            }
        }
        if (library.id && (library.id > 0)) {
            options.where.id = { [Op.ne]: library.id }
        }
        const result = await Library.findOne(options);
        return (!result);
    } else {
        return true;
    }
}

export const validateRefreshTokenUnique
    = async (refreshToken: RefreshToken): Promise<boolean> =>
{
    if (refreshToken) {
        let options: any = {
            where: {
                token: refreshToken.token,
            }
        }
        if (refreshToken.id && (refreshToken.id > 0)) {
            options.where.id = { [Op.ne]: refreshToken.id }
        }
        const result = await RefreshToken.findOne(options);
        return (!result);
    } else {
        return true;
    }
}

export const validateUserId = async (userId: number): Promise<boolean> => {
    if (userId) {
        const user: User | null = await User.findByPk(userId);
        return (user !== null);
    } else {
        return true;
    }
}

export const validateUserUsernameUnique
    = async (user: User): Promise<boolean> =>
{
    if (user) {
        let options: any = {
            where: {
                username: user.username,
            }
        }
        if (user.id) {
            options.where.id = { [Op.ne]: user.id }
        }
        const results: User[] = await User.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

export const validateVolumeId = async (volumeId: number): Promise<boolean> => {
    if (volumeId) {
        const volume = await Volume.findByPk(volumeId);
        return (volume !== null);
    } else {
        return true;
    }
}

export const validateVolumeNameUnique
    = async (volume: Volume): Promise<boolean> =>
{
    if (volume) {
        let options: any = {
            where: {
                libraryId: volume.libraryId,
                name: volume.name,
            }
        }
        if (volume.id && (volume.id > 0)) {
            options.where.id = { [Op.ne]: volume.id }
        }
        const result = await Volume.findOne(options);
        return (!result);
    } else {
        return true;
    }
}
