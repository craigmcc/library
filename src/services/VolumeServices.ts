// VolumeServices ------------------------------------------------------------

// Services implementation for Volume models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

//import AuthorServices from "./AuthorServices";
import BaseChildServices from "./BaseChildServices";
import LibraryServices from "./LibraryServices";
//import StoryServices from "./StoryServices";
//import Author from "../models/Author";
import Library from "../models/Library";
//import Story from "../models/Story";
import Volume from "../models/Volume";
//import VolumeStory from "../models/VolumeStory";
import {NotFound} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrder";

// Public Objects ------------------------------------------------------------

class VolumeServices extends BaseChildServices<Volume, Library> {

    constructor () {
        super(Library, Volume, SortOrder.VOLUMES, [
            "active",
            "copyright",
            "googleId",
            "isbn",
            "libraryId",
            "location",
            "name",
            "notes",
            "read",
            "type",
        ]);
    }

    // Model-Specific Methods ------------------------------------------------

    /*
        public async authors(libraryId: number, volumeId: number, query?: any): Promise<Author[]> {
            const volume = await this.read("VolumeServices.authors", libraryId, volumeId);
            const options: FindOptions = AuthorServices.appendMatchOptions({
                order: SortOrder.AUTHORS,
            }, query);
            return await volume.$get("authors", options);
        }
    */

    public async exact(libraryId: number, name: string, query?: any): Promise<Volume> {
        const library = await LibraryServices.read("VolumeServices.exact", libraryId);
        const options: FindOptions = this.appendIncludeOptions({
            where: { name: name }
        }, query);
        const results = await library.$get("volumes", options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing Volume '${name}'`,
                "VolumeServices.exact"
            );
        }
        return results[0];
    }

    /*
        public async stories(libraryId: number, volumeId: number, query?: any): Promise<Story[]> {
            const volume = await this.read("VolumeServices.stories", libraryId, volumeId);
            const options: FindOptions = StoryServices.appendMatchOptions({
                order: SortOrder.STORIES,
            }, query);
            return await volume.$get("stories", options);
        }
    */

    // TODO - storiesExclude()

    // TODO - storiesInclude()

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withAuthors                    Include related Authors
     * * withLibrary                    Include parent Library
     * * withStories                    Include related Stories
     */
    public appendIncludeOptions(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPaginationOptions(options, query);
        const include: any = options.include ? options.include : [];
/*
        if ("" === query.withAuthors) {
            include.push(Author);
        }
*/
        if ("" === query.withLibrary) {
            include.push(Library);
        }
/*
        if ("" === query.withStories) {
            include.push(Story);
        }
*/
        if (include.length > 0) {
            options.include = include;
        }
        return options;
    }

    /**
     * Supported match query parameters:
     * * active                         Select active Volumes
     * * googleId={googleId}            Select Volumes on googleId equaling {googleId}
     * * isbn={isbn}                    Select Volumes on isbn equaling {isbn}
     * * location={location}            Select Volumes on location equaling {location}
     * * name={wildcard}                Select Volumes on name matching {wildcard}
     * * type={type}                    Select Volumes on type equalling {type}
     */
    public appendMatchOptions(options: FindOptions, query?: any): FindOptions {
        options = this.appendIncludeOptions(options, query);
        if (!query) {
            return options;
        }
        const where: any = options.where ? options.where : {};
        if ("" === query.active) {
            where.active = true;
        }
        if (query.googleId) {
            where.googleId = query.googleId;
        }
        if (query.isbn) {
            where.isbn = query.isbn;
        }
        if (query.location) {
            where.location = query.location;
        }
        if (query.name) {
            where.name = { [Op.iLike]: `%${query.name}%` };
        }
        if (query.type) {
            where.type = query.type;
        }
        if (Object.keys(where).length > 0) {
            options.where = where;
        }
        return options;
    }

}

export default new VolumeServices();