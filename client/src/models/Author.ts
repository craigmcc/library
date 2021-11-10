// Author --------------------------------------------------------------------

// Contributor to one or more series, stories, and/or volumes.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Library from "./Library";
import Series from "./Series";
import Story from "./Story";
import Volume from "./Volume";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const AUTHORS_BASE = "/authors";

class Author {

    constructor(data: any = {}) {

        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.firstName = data.firstName ? data.firstName : null;
        this.lastName = data.lastName ? data.lastName : null;
        this.libraryId = data.libraryId ? data.libraryId : null;
        this.notes = data.notes;
        this.principal = this.calculatePrincipal(data);

        this.library = data.library ? ToModel.LIBRARY(data.library) : undefined;
        this.series = data.series ? ToModel.SERIESES(data.series) : undefined;
        this.stories = data.stories ? ToModel.STORIES(data.stories) : undefined;
        this.volumes = data.volumes ? ToModel.VOLUMES(data.volumes) : undefined;

        this._model = this.constructor.name;
        this._title = this.firstName + " " + this.lastName;

    }

    id!: number;
    active!: boolean;
    firstName!: string;
    lastName!: string;
    libraryId!: number;
    notes?: string;
    principal!: boolean;

    library?: Library;
    series?: Series[];
    stories?: Story[];
    volumes?: Volume[];

    _model!: string;
    _title!: string;

    private calculatePrincipal(data: any): boolean {
        if (data.principal !== undefined) {
            return data.principal;
        } else if (data.AuthorSeries && (data.AuthorSeries.principal !== undefined)) {
            return data.AuthorSeries.principal;
        } else if (data.AuthorStory && (data.AuthorStory.principal !== undefined)) {
            return data.AuthorStory.principal;
        } else if (data.AuthorVolume && (data.AuthorVolume.principal !== undefined)) {
            return data.AuthorVolume.principal;
        } else {
            return false;
        }
    }

}

export default Author;
