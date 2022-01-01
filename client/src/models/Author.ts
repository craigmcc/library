// Author --------------------------------------------------------------------

// Contributor to one or more series, stories, and/or volumes.

// Internal Modules ----------------------------------------------------------

import Library from "./Library";
import Series from "./Series";
import Story from "./Story";
import Volume from "./Volume";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const AUTHORS_BASE = "/authors";

export class AuthorData {

    constructor (data: any = {}) {
        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.firstName = data.firstName ? data.firstName : null;
        this.lastName = data.lastName ? data.lastName : null;
        this.libraryId = data.libraryId ? data.libraryId : -1;
        this.notes = data.notes;
        this.principal = false;
        if (data.principal !== undefined) {
            this.principal = data.principal;
        } else if (data.AuthorSeries && (data.AuthorSeries.principal !== undefined)) {
            this.principal = data.AuthorSeries.principal;
        } else if (data.AuthorStory && (data.AuthorStory.principal !== undefined)) {
            this.principal = data.AuthorStory.principal;
        } else if (data.AuthorVolume && (data.AuthorVolume.principal !== undefined)) {
            this.principal = data.AuthorVolume.principal;
        }
    }

    id: number;
    active: boolean;
    firstName: string;
    lastName: string;
    libraryId: number;
    notes: string;
    principal: boolean;

}
class Author extends AuthorData {

    constructor(data: any = {}) {

        super(data);

        this.library = data.library ? ToModel.LIBRARY(data.library) : undefined;
        this.series = data.series ? ToModel.SERIESES(data.series) : undefined;
        this.stories = data.stories ? ToModel.STORIES(data.stories) : undefined;
        this.volumes = data.volumes ? ToModel.VOLUMES(data.volumes) : undefined;

        this._model = "Author";
        this._title = this.lastName + ", " + this.firstName;

    }

    library?: Library;
    series?: Series[];
    stories?: Story[];
    volumes?: Volume[];

    _model: string;
    _title: string;

}

export default Author;
