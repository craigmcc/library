// Series --------------------------------------------------------------------

// A named and ordered list of Stories in the same timeline.

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import Library from "./Library";
import Model from "./Model";
import Story from "./Story";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const SERIES_BASE = "/series";

export class SeriesData extends Model<Series> {

    constructor(data: any = {}) {
        super();
        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.copyright = data.copyright ? data.copyright : null;
        this.libraryId = data.libraryId ? data.libraryId : -1;
        this.name = data.name ? data.name : null;
        this.notes = data.notes ? data.notes : null;

    }

    id: number;
    active: boolean;
    copyright: string;
    libraryId: number;
    name: string;
    notes: string;

}

class Series extends SeriesData {

    constructor(data: any = {}) {

        super(data);

        this.authors = data.authors ? ToModel.AUTHORS(data.authors) : undefined;
        this.library = data.library ? ToModel.LIBRARY(data.library) : undefined;
        this.stories = data.stories ? ToModel.STORIES(data.stories) : undefined;

        this._model = "Series";
        this._title = this.name;

    }

    authors?: Author[];
    library?: Library;
    stories?: Story[];

    _model: string;
    _title: string;

}

export default Series;
