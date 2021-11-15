// SeriesServices -------------------------------------------------------------

// Services implementation for Series models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AuthorServices from "./AuthorServices";
import BaseChildServices from "./BaseChildServices";
import LibraryServices from "./LibraryServices";
import StoryServices from "./StoryServices";
import Author from "../models/Author";
import Library from "../models/Library";
import Series from "../models/Series";
import Story from "../models/Story";
import SeriesStory from "../models/SeriesStory";
import {NotFound} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrder";

// Public Objects ------------------------------------------------------------

class SeriesServices extends BaseChildServices<Series, Library> {

    constructor () {
        super(Library, Series, SortOrder.SERIES, [
            "active",
            "copyright",
            "libraryId",
            "name",
            "notes",
        ]);
    }

    // Model-Specific Methods ------------------------------------------------

    public async authors(libraryId: number, seriesId: number, query?: any): Promise<Author[]> {
        const library = await LibraryServices.read("SeriesServices.authors", libraryId);
        const series = await this.read("SeriesServices.authors", libraryId, seriesId);
        const options: FindOptions = AuthorServices.appendMatchOptions({
            order: SortOrder.AUTHORS,
        }, query);
        return await series.$get("authors", options);
    }

    public async exact(libraryId: number, name: string, query?: any): Promise<Series> {
        const library = await LibraryServices.read("SeriesServices.exact", libraryId);
        const options: FindOptions = this.appendIncludeOptions({
            where: { name: name }
        }, query);
        const results = await library.$get("series", options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing Series '${name}'`,
                "SeriesServices.exact"
            );
        }
        return results[0];
    }

    public async stories(libraryId: number, seriesId: number, query?: any): Promise<Story[]> {
        const library = await LibraryServices.read("SeriesServices.stories", libraryId);
        const series = await this.read("SeriesServices.stories", libraryId, seriesId);
        const options: FindOptions = StoryServices.appendMatchOptions({
            order: SortOrder.STORIES,
        }, query);
        return await series.$get("stories", options);
    }

    public async storiesExclude(libraryId: number, seriesId: number, storyId: number): Promise<Story> {
        await LibraryServices.read("SeriesServices.storiesExclude", libraryId);
        const series = await this.read("SeriesServices.storesExclude", libraryId, seriesId);
        const story = await StoryServices.read("SeriesServices.storiesExclude", libraryId, storyId);
        await series.$remove("stories", story);
        return story;
    }

    public async storiesInclude(libraryId: number, seriesId: number, storyId: number, ordinal: number | undefined): Promise<Story> {
        await LibraryServices.read("SeriesServices.storiesInclude", libraryId);
        await this.read("SeriesServices.storiesInclude", libraryId, seriesId);
        const story = await StoryServices.read("SeriesServices.storiesInclude", libraryId, storyId);
        // @ts-ignore
        await SeriesStory.create({
            seriesId: seriesId,
            storyId: storyId,
            ordinal: ordinal,
        });
        return story;
    }

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
        if ("" === query.withAuthors) {
            include.push(Author);
        }
        if ("" === query.withLibrary) {
            include.push(Library);
        }
        if ("" === query.withStories) {
            include.push(Story);
        }
        if (include.length > 0) {
            options.include = include;
        }
        return options;
    }

    /**
     * Supported match query parameters:
     * * active                         Select active Series
     * * name={wildcard}                Select Series on name matching {wildcard}
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
        if (query.name) {
            where.name = { [Op.iLike]: `%${query.name}%` };
        }
        if (Object.keys(where).length > 0) {
            options.where = where;
        }
        return options;
    }

}

export default new SeriesServices();
