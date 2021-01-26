// LibraryUserServices -------------------------------------------------------

// Services implementation for Library -> User models.

// External Modules ----------------------------------------------------------

import { FindOptions, Op } from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractLibraryServices from "./AbstractLibraryServices";
import { hashPassword } from "../util/oauth-utils";
import Library from "../models/Library";
import User from "../models/User";
import { BadRequest, NotFound, ServerError } from "../util/http-errors";
import { appendPagination } from "../util/query-parameters";
import { USER_ORDER } from "../util/sort-orders";

const USERS_FIELD = "users";

// Public Objects ------------------------------------------------------------

class LibraryUserServices extends AbstractLibraryServices {

    // Public Methods --------------------------------------------------------

    public async active(libraryId: number, query?: any): Promise<User[]> {
        const library = await this.lookupLibrary(libraryId);
        const options = this.appendQuery({
            order: USER_ORDER,
            where: {
                active: true,
            },
        }, query);
        const results = await library.$get(USERS_FIELD, options);
        results.forEach(result => {
            result.password = "";
        });
        return results;
    }

    public async all(libraryId: number, query?: any): Promise<User[]> {
        const library = await this.lookupLibrary(libraryId);
        const options = this.appendQuery({
            order: USER_ORDER,
        }, query);
        const results = await library.$get(USERS_FIELD, options);
        results.forEach(result => {
            result.password = "";
        });
        return results;
    }

    // NOTE: Match by username, not name
    public async exact(
        libraryId: number, username: string, query?: any
    ): Promise<User> {
        const library = await this.lookupLibrary(libraryId);
        const options = this.appendQuery({
            where: {
                username: username,
            },
        }, query);
        const results = await library.$get(USERS_FIELD, options);
        if (results.length < 1) {
            throw new NotFound(
                `username: Missing User '${username}'`,
                "LibraryUserServices.exact"
            );
        }
        results[0].password = "";
        return results[0];
    }

    public async find(
        libraryId: number, userId: number, query?: any
    ): Promise<User> {
        const library = await this.lookupLibrary(libraryId);
        const options = this.appendQuery({
            where: {
                id: userId,
            },
        }, query);
        const results = await library.$get(USERS_FIELD, options);
        if (results.length < 1) {
            throw new NotFound(
                `userId: Missing User ${userId}`,
                "LibraryUserServices.find"
            );
        }
        results[0].password = "";
        return results[0];
    }

    public async insert(libraryId: number, user: User): Promise<User> {
        const library = await this.lookupLibrary(libraryId);
        user.libraryId = libraryId; // No cheating
        if (!user.password || (user.password.length === 0)) {
            throw new BadRequest(
                `password: Is required for a new User`,
                "LibraryUserServices.insert"
            );
        }
        user.password = await hashPassword(user.password);
        const result = await User.create(user, {
            fields: fields
        });
        result.password = "";
        return result;
    }

    public async name(
        libraryId: number, name: string, query?: any
    ): Promise<User[]> {
        const library = await this.lookupLibrary(libraryId);
        const options = this.appendQuery({
            order: USER_ORDER,
            where: {
                name: {[Op.iLike]: '%{name}%'},
            },
        }, query);
        const results = await library.$get(USERS_FIELD, options);
        results.forEach(result => {
            result.password = "";
        });
        return results;
    }

    public async remove(libraryId: number, userId: number): Promise<User> {
        const library = await this.lookupLibrary(libraryId);
        const removed = await User.findByPk(userId);
        if (!removed) {
            throw new NotFound(
                `userId: Missing User ${userId}`,
                "LibraryUserServices.remove"
            );
        }
        if (removed.libraryId !== library.id) { // No cheating
            throw new BadRequest(
                `userId: User ${userId} does not belong to this Library`,
                "LibraryUserServices.remove"
            );
        }
        const count = await User.destroy({
            where: { id: userId }
        });
        if (count < 1) {
            throw new NotFound(
                `userId: Cannot remove User ${userId}`,
                "LibraryUserServices.remove"
            );
        }
        removed.password = "";
        return removed;
    }

    public async update(
        libraryId: number, userId: number, user: User
    ): Promise<User> {
        const library = await this.lookupLibrary(libraryId);
        const updated = await User.findByPk(userId);
        if (!updated) {
            throw new NotFound(
                `userId: Missing User ${userId}`,
                "LibraryUserServices.update"
            );
        }
        if (updated.libraryId !== library.id) { // No cheating
            throw new BadRequest(
                `userId: User ${userId} does not belong to this Library`,
                "LibraryUserServices.update"
            );
        }
        user.id = userId;
        if (user.password) {
            user.password = await hashPassword(user.password);
        }
        const [count, dummy] = await User.update(user, {
            fields: fieldsWithId,
            where: { id: userId }
        });
        if (count !== 1) {
            throw new ServerError(
                `userId: Cannot update User ${userId}`,
                "LibraryUserServices.update"
            );
        }
        const result = await User.findByPk(userId);
        if (result) {
            result.password = "";
            return result;
        } else {
            throw new ServerError(
                `userId: Cannot reload User ${userId}`,
                "LibraryUserServices.update"
            );
        }
    }

    // Private Methods --------------------------------------------------------

    private appendQuery(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPagination(options, query);
        let include = [];
        if ("" === query.withLibrary) {
            include.push(Library);
        }
        if (include.length > 0) {
            options.include = include;
        }
        return options;
    }

}

export default new LibraryUserServices();

// Private Objects -----------------------------------------------------------

const fields: string[] = [
    "active",
    "level",
    "libraryId",
    "name",
    "notes",
    "password",
    "scope",
    "username",
];

const fieldsWithId: string[] = [
    ...fields,
    "id"
];
