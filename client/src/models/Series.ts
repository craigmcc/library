// Series --------------------------------------------------------------------

// A named and ordered list of Stories in the same timeline.

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import Library from "./Library";
import SeriesData from "./SeriesData";
import Story from "./Story";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const SERIES_BASE = "/series";

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
