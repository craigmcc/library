// async-validators ----------------------------------------------------------

// Custom (to this application) validation methods that can only be used by
// server side applications, because they interact directly with the database.
// In all cases, a "true" return indicates that the proposed value is valid,
// while "false" means it is not.  If a field is required, that must be
// validated separately.

// External Modules ----------------------------------------------------------

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
        if (accessToken.id) {
            options.where.id = { [Op.ne]: accessToken.id }
        }
        const results: AccessToken[] = await AccessToken.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

export const validateAuthorNameUnique
    = async (author: Author): Promise<boolean> =>
{
    if (author) {
        let options: any = {};
        if (author.id && (author.id > 0)) {
            options = {
                where: {
                    id: author.id,
                    firstName: author.firstName,
                    lastName: author.lastName
                }
            }
        } else {
            options = {
                where: {
                    id: author.id,
                    firstName: author.firstName,
                    lastName: author.lastName
                }
            }
        }
        const results = await Author.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

export const validateLibraryId = async (libraryId: number): Promise<boolean> => {
    if (libraryId) {
        const library: Library | null = await Library.findByPk(libraryId);
        return (library !== null);
    } else {
        return true;
    }
}

export const validateLibraryNameUnique
    = async (library: Library): Promise<boolean> =>
{
    if (library) {
        let options: any = {};
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
        let results: Library[] = await Library.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

export const validateLibraryScopeUnique
    = async (library: Library): Promise<boolean> =>
{
    if (library) {
        let options: any = {};
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
        let results: Library[] = await Library.findAll(options);
        return (results.length === 0);
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
        if (refreshToken.id) {
            options.where.id = { [Op.ne]: refreshToken.id }
        }
        const results: RefreshToken[] = await RefreshToken.findAll(options);
        return (results.length === 0);
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

