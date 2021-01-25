// UserServices ----------------------------------------------------------

// Services implementation for User models.

// External Modules ----------------------------------------------------------

import { FindOptions, Op } from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractServices from "./AbstractServices";
import AccessToken from "../models/AccessToken";
import Library from "../models/Library";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";
import { BadRequest, NotFound } from "../util/http-errors";
import { hashPassword } from "../util/oauth-utils";
import { appendPagination } from "../util/query-parameters";
import { USER_ORDER } from "../util/sort-orders";

// Public Objects ------------------------------------------------------------

export class UserServices extends AbstractServices<User> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(query?: any): Promise<User[]> {
        const options: FindOptions = appendQuery({
            order: USER_ORDER
        }, query);
        const results = await User.findAll(options);
        results.forEach(result => {
            result.password = "";
        })
        return results;
    }

    public async find(userId: number, query?: any): Promise<User> {
        const options: FindOptions = appendQuery({
            where: { id: userId }
        }, query);
        const results = await User.findAll(options);
        if (results.length === 1) {
            results[0].password = "";
            return results[0];
        } else {
            throw new NotFound(
                `userId: Missing User ${userId}`,
                "UserServices.find()");
        }
    }

    public async insert(user: User): Promise<User> {
        if (!user.password || (user.password.length === 0)) {
            throw new BadRequest("password: Is required for a new User");
        }
        user.password = await hashPassword(user.password);
        return await User.create(user, {
            fields: fields,
        });
    }

    public async remove(userId: number): Promise<User> {
        const removed = await User.findByPk(userId);
        if (!removed) {
            throw new NotFound(
                `userId: Missing User ${userId}`,
                "UserServices.remove()");
        }
        const count = await User.destroy({
            where: { id: userId }
        });
        if (count < 1) {
            throw new NotFound(
                `userId: Cannot remove User ${userId}`,
                "UserServices.remove()");
        }
        return removed;
    }

    public async update(userId: number, user: User): Promise<User> {
        user.id = userId;
        if (user.password) {
            user.password = await hashPassword(user.password);
        }
        const result: [number, User[]] = await User.update(user, {
            fields: fieldsWithId,
            returning: true,
            where: { id: userId }
        });
        if (result[0] < 1) {
            throw new NotFound(
                `userId: Cannot update User ${userId}`,
                "UserServices.update()");
        }
        return result[1][0];
    }

    // Model-Specific Methods ------------------------------------------------

    // ***** User Lookups *****

    public async active(query?: any): Promise<User[]> {
        const options: FindOptions = appendQuery({
            order: USER_ORDER,
            where: {
                active: true
            }
        }, query);
        const results = await User.findAll(options);
        results.forEach(result => {
            result.password = "";
        });
        return results;
    }

    public async exact(name: string, query?: any): Promise<User> {
        const options: FindOptions = appendQuery({
            where: {
                username: name
            }
        }, query);
        let results = await User.findAll(options);
        if (results.length !== 1) {
            throw new NotFound(
                `username: Missing User username '${name}'`,
                "UserServices.exact()");
        }
        results[0].password = "";
        return results[0];
    }

    public async name(name: string, query?: any): Promise<User[]> {
        const options: FindOptions = appendQuery({
            order: USER_ORDER,
            where: {
                name: { [Op.iLike]: `%${name}%` }
            }
        }, query);
        const results = await User.findAll(options);
        results.forEach(result => {
            result.password = "";
        });
        return results;
    }

    public async scope(scope: string, query?: any): Promise<User> {
        const options: FindOptions = appendQuery({
            where: {
                scope: scope
            }
        }, query);
        let results = await User.findAll(options);
        if (results.length !== 1) {
            throw new NotFound(
                `username: Missing User scope '${scope}'`,
                "UserServices.scope()");
        }
        results[0].password = "";
        return results[0];
    }

}

export default new UserServices();

// Private Objects -----------------------------------------------------------

const appendQuery = (options: FindOptions, query?: any): FindOptions => {

    if (!query) {
        return options;
    }
    options = appendPagination(options, query);

    // Inclusion parameters
    let include = [];
    if ("" === query.withAccessTokens) {
        include.push(AccessToken);
    }
    if ("" === query.withLibrary) {
        include.push(Library);
    }
    if ("" === query.withRefreshTokens) {
        include.push(RefreshToken);
    }
    if (include.length > 0) {
        options.include = include;
    }

    return options;

}

let fields: string[] = [
    "active",
    "level",
    "libraryId",
    "name",
    "notes",
    "password",
    "scope",
    "username",
];
let fieldsWithId: string[] = [
    ...fields,
    "id"
];
