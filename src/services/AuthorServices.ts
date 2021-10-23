// AuthorServices -------------------------------------------------------------

// Services implementation for Author models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import BaseChildServices from "./BaseChildServices";
import LibraryServices from "./LibraryServices";
import SeriesServices from "./SeriesServices";
import StoryServices from "./StoryServices";
import VolumeServices from "./VolumeServices";
import Author from "../models/Author";
import Library from "../models/Library";
import Series from "../models/Series";
import Story from "../models/Story";
import Volume from "../models/Volume";
import {NotFound} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrder";

// Public Objects ------------------------------------------------------------

class AuthorServices extends BaseChildServices<Author, Library> {

    constructor () {
        super(Library, Author, SortOrder.AUTHORS, [
            "active",
            "firstName",
            "lastName",
            "libraryId",
            "notes",
        ]);
    }

    // Model-Specific Methods ------------------------------------------------

    public async exact(libraryId: number, firstName: string, lastName: string, query?: any): Promise<Author> {
        const library = await LibraryServices.read("AuthorServices.exact", libraryId);
        const options: FindOptions = this.appendIncludeOptions({
            where: {
                firstName: firstName,
                lastName: lastName,
            }
        }, query);
        const results = await library.$get("authors", options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing Author '${firstName} ${lastName}'`,
                "AuthorServices.exact"
            );
        }
        return results[0];
    }

/*
    public async series(libraryId: number, authorId: number, query?: any): Promise<Series[]> {
        const author = await this.read("AuthorServices.series", libraryId, authorId);
        const options: FindOptions = SeriesServices.appendMatchOptions({
            order: SortOrder.SERIES,
        }, query);
        return await author.$get("series", options);
    }
*/

/*
    public async stories(libraryId: number, authorId: number, query?: any): Promise<Story[]> {
        const author = await this.read("AuthorServices.stories", libraryId, authorId);
        const options: FindOptions = StoryServices.appendMatchOptions({
            order: SortOrder.STORIES,
        }, query);
        return await author.$get("stories", options);
    }
*/

/*
    public async volumes(libraryId: number, authorId: number, query?: any): Promise<Volume[]> {
        const author = await this.read("AuthorServices.volumes", libraryId, authorId);
        const options: FindOptions = VolumeServices.appendMatchOptions({
            order: SortOrder.VOLUMES,
        }, query);
        return await author.$get("volumes", options);
    }
*/

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withAuthors                    Include related Authors
     * * withLibrary                    Include parent Library
     * * withSeries                     Include related Series
     * * withStories                    Include related Stories
     * * withVolumes                    Include related Volumes
     */
    public appendIncludeOptions(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPaginationOptions(options, query);
        const include: any = options.include ? options.include : [];
        if ("" === query.withLibrary) {
            include.push(Library);
        }
        if ("" === query.withSeries) {
            include.push(Series);
        }
        if ("" === query.withStories) {
            include.push(Story);
        }
        if ("" === query.withVolumes) {
            include.push(Volume);
        }
        if (include.length > 0) {
            options.include = include;
        }
        return options;
    }

    /**
     * Supported match query parameters:
     * * active                         Select active Authors
     * * name={wildcard}                Select Authors on name matching {wildcard}
     */
    public appendMatchOptions(options: FindOptions, query?: any): FindOptions {
        options = this.appendIncludeOptions(options, query);
        if (!query) {
            return options;
        }
        let where: any = options.where ? options.where : {};
        if ("" === query.active) {
            where.active = true;
        }
        if (query.name) {
            const names = query.name.trim().split(" ");
            const firstMatch = names[0];
            const lastMatch = (names.length > 1) ? names[1] : names[0];
            where = {
                ...where,
                [Op.or]: {
                    firstName: {[Op.iLike]: `%${firstMatch}%`},
                    lastName: {[Op.iLike]: `%${lastMatch}%`},
                }
            }
        }
        if (Object.keys(where).length > 0) {
            options.where = where;
        }
        return options;
    }

}

export default new AuthorServices();
