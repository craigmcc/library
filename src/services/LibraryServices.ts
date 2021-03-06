// LibraryServices ----------------------------------------------------------

// Services implementation for Library models.

// External Modules ----------------------------------------------------------

import { FindOptions, Op } from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractServices from "./AbstractServices";
import Author from "../models/Author";
import Library from "../models/Library";
import User from "../models/User";
import Volume from "../models/Volume";
import { NotFound, ServerError } from "../util/http-errors";
import { appendPagination } from "../util/query-parameters";
import { LIBRARY_ORDER } from "../util/sort-orders";

// Public Objects ------------------------------------------------------------

export class LibraryServices extends AbstractServices<Library> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(query?: any): Promise<Library[]> {
        const options: FindOptions = appendQuery({
            order: LIBRARY_ORDER
        }, query);
        return await Library.findAll(options);
    }

    public async find(libraryId: number, query?: any): Promise<Library> {
        const options: FindOptions = appendQuery({
            where: { id: libraryId }
        }, query);
        const results = await Library.findAll(options);
        if (results.length === 1) {
            return results[0];
        } else {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryServices.find");
        }
    }

    public async insert(library: Library): Promise<Library> {
        return await Library.create(library, {
            fields: fields,
        });
    }

    public async remove(libraryId: number): Promise<Library> {
        const removed = await Library.findByPk(libraryId);
        if (!removed) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryServices.remove");
        }
        const count = await Library.destroy({
            where: { id: libraryId }
        });
        if (count < 1) {
            throw new NotFound(
                `libraryId: Cannot remove Library ${libraryId}`,
                "LibraryServices.remove");
        }
        return removed;
    }

    public async update(libraryId: number, library: Library): Promise<Library> {
        library.id = libraryId;
        const [count, dummy] = await Library.update(library, {
            fields: fieldsWithId,
            where: { id: libraryId }
        });
        if (count !== 1) {
            throw new ServerError(
                `libraryId: Cannot update Library ${libraryId}`,
                "LibraryServices.update"
            );
        }
        const result = Library.findByPk(libraryId);
        if (result) {
            // @ts-ignore
            return result;
        } else {
            throw new ServerError(
                `libraryId: Cannot reload Library ${libraryId}`,
                "LibraryServices.update"
            );
        }

    }

    // Model-Specific Methods ------------------------------------------------

    // ***** Library Lookups *****

    public async active(query?: any): Promise<Library[]> {
        const options: FindOptions = appendQuery({
            order: LIBRARY_ORDER,
            where: {
                active: true
            }
        }, query);
        return await Library.findAll(options);
    }

    public async exact(name: string, query?: any): Promise<Library> {
        const options: FindOptions = appendQuery({
            where: {
                name: name
            }
        }, query);
        let results = await Library.findAll(options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing Library name '${name}'`,
                "LibraryServices.exact");
        }
        return results[0];
    }

    public async name(name: string, query?: any): Promise<Library[]> {
        const options: FindOptions = appendQuery({
            order: LIBRARY_ORDER,
            where: {
                name: { [Op.iLike]: `%${name}%` }
            }
        }, query);
        return await Library.findAll(options);
    }

    public async scope(scope: string, query?: any): Promise<Library> {
        const options: FindOptions = appendQuery({
            where: {
                scope: scope
            }
        }, query);
        let results = await Library.findAll(options);
        if (results.length !== 1) {
            throw new NotFound(
                `username: Missing Library scope '${scope}'`,
                "LibraryServices.scope");
        }
        return results[0];
    }

}

export default new LibraryServices();

// Private Objects -----------------------------------------------------------

const appendQuery = (options: FindOptions, query?: any): FindOptions => {

    if (!query) {
        return options;
    }
    options = appendPagination(options, query);

    // Inclusion parameters
    let include = [];
    if ("" === query.withAuthors) {
        include.push(Author);
    }
    if ("" === query.withUsers) {
        include.push(User);
    }
    if ("" === query.withVolumes) {
        include.push(Volume);
    }
    if (include.length > 0) {
        options.include = include;
    }

    return options;

}

let fields: string[] = [
    "active",
    "name",
    "notes",
    "scope",
];
let fieldsWithId: string[] = [
    ...fields,
    "id"
];
