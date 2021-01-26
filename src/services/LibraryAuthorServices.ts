// LibraryAuthorServices -----------------------------------------------------

// Services implementation for Library -> Author models.

// External Modules ----------------------------------------------------------

import { FindOptions, Op } from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractLibraryServices from "./AbstractLibraryServices";
import Author from "../models/Author";
import Library from "../models/Library";
import { BadRequest, NotFound, ServerError } from "../util/http-errors";
import { appendPagination } from "../util/query-parameters";
import { AUTHOR_ORDER } from "../util/sort-orders";

const AUTHORS_FIELD = "authors";

// Public Objects ------------------------------------------------------------

class LibraryAuthorServices extends AbstractLibraryServices {

    // Public Methods --------------------------------------------------------

    public async active(libraryId: number, query?: any): Promise<Author[]> {
        const library = await this.lookupLibrary(libraryId);
        const options = this.appendQuery({
            order: AUTHOR_ORDER,
            where: {
                active: true,
            },
        }, query);
        const results = await library.$get(AUTHORS_FIELD, options);
        return results;
    }

    public async all(libraryId: number, query?: any): Promise<Author[]> {
        const library = await this.lookupLibrary(libraryId);
        const options = this.appendQuery({
            order: AUTHOR_ORDER,
        }, query);
        const results = await library.$get(AUTHORS_FIELD, options);
        return results;
    }

    public async exact(
        libraryId: number, firstName: string, lastName: string, query?: any
    ): Promise<Author> {
        const library = await this.lookupLibrary(libraryId);
        const options = this.appendQuery({
            where: {
                firstName: firstName,
                lastName: lastName,
            },
        }, query);
        const results = await library.$get(AUTHORS_FIELD, options);
        if (results.length < 1) {
            throw new NotFound(
                `authorname: Missing Author '${firstName} ${lastName}'`,
                "LibraryAuthorServices.exact"
            );
        }
        return results[0];
    }

    public async find(
        libraryId: number, authorId: number, query?: any
    ): Promise<Author> {
        const library = await this.lookupLibrary(libraryId);
        const options = this.appendQuery({
            where: {
                id: authorId,
            },
        }, query);
        const results = await library.$get(AUTHORS_FIELD, options);
        if (results.length < 1) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "LibraryAuthorServices.find"
            );
        }
        return results[0];
    }

    public async insert(libraryId: number, author: Author): Promise<Author> {
        const library = await this.lookupLibrary(libraryId);
        author.libraryId = libraryId; // No cheating
        const result = await Author.create(author, {
            fields: fields
        });
        return result;
    }

    public async name(
        libraryId: number, name: string, query?: any
    ): Promise<Author[]> {
        const library = await this.lookupLibrary(libraryId);
        const names = name.trim().split(" ");
        let options: FindOptions = {};
        if (names.length < 2) {
            const options = this.appendQuery({
                order: AUTHOR_ORDER,
                where: {
                    [Op.or]: {
                        firstName: {[Op.iLike]: `%${names[0]}%`},
                        lastName: {[Op.iLike]: `%${names[0]}%`},
                    }
                },
            }, query);
        } else {
            const options = this.appendQuery({
                order: AUTHOR_ORDER,
                where: {
                    [Op.or]: {
                        firstName: {[Op.iLike]: `%${names[0]}%`},
                        lastName: {[Op.iLike]: `%${names[1]}%`},
                    }
                },
            }, query);
        }
        const results = await library.$get(AUTHORS_FIELD, options);
        return results;
    }

    public async remove(libraryId: number, authorId: number): Promise<Author> {
        const library = await this.lookupLibrary(libraryId);
        const removed = await Author.findByPk(authorId);
        if (!removed) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "LibraryAuthorServices.remove"
            );
        }
        if (removed.libraryId !== library.id) { // No cheating
            throw new BadRequest(
                `authorId: Author ${authorId} does not belong to this Library`,
                "LibraryAuthorServices.remove"
            );
        }
        const count = await Author.destroy({
            where: { id: authorId }
        });
        if (count < 1) {
            throw new NotFound(
                `authorId: Cannot remove Author ${authorId}`,
                "LibraryAuthorServices.remove"
            );
        }
        return removed;
    }

    public async update(
        libraryId: number, authorId: number, author: Author
    ): Promise<Author> {
        const library = await this.lookupLibrary(libraryId);
        const updated = await Author.findByPk(authorId);
        if (!updated) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "LibraryAuthorServices.update"
            );
        }
        if (updated.libraryId !== library.id) { // No cheating
            throw new BadRequest(
                `authorId: Author ${authorId} does not belong to this Library`,
                "LibraryAuthorServices.update"
            );
        }
        author.id = authorId;
        const [count, dummy] = await Author.update(author, {
            fields: fieldsWithId,
            where: { id: authorId }
        });
        if (count !== 1) {
            throw new ServerError(
                `authorId: Cannot update Author ${authorId}`,
                "LibraryAuthorServices.update"
            );
        }
        const result = await Author.findByPk(authorId);
        if (result) {
            return result;
        } else {
            throw new ServerError(
                `authorId: Cannot reload Author ${authorId}`,
                "LibraryAuthorServices.update"
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

export default new LibraryAuthorServices();

// Private Objects -----------------------------------------------------------

const fields: string[] = [
    "active",
    "firstName",
    "lastName",
    "libraryId",
    "notes",
];

const fieldsWithId: string[] = [
    ...fields,
    "id"
];
