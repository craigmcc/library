// Author --------------------------------------------------------------------

// Contributor to one or more series, stories, and/or volumes.

// Internal Modules ----------------------------------------------------------

import AuthorData from "./AuthorData";
import Library from "./Library";
import Series from "./Series";
import Story from "./Story";
import Volume from "./Volume";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const AUTHORS_BASE = "/authors";

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
