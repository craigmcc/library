// Library -------------------------------------------------------------------

// Overall collection of Authors, Series, Stories, and Volumes.

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import LibraryData from "./LibraryData";
import Series from "./Series";
import Story from "./Story";
import Volume from "./Volume";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const LIBRARIES_BASE = "/libraries";

class Library extends LibraryData {

    constructor(data: any = {}) {

        super(data);

        this.authors = data.authors ? ToModel.AUTHORS(data.authors) : undefined;
        this.series = data.series ? ToModel.SERIESES(data.series) : undefined;
        this.stories = data.stories ? ToModel.STORIES(data.stories) : undefined;
        this.volumes = data.volumes ? ToModel.VOLUMES(data.volumes) : undefined;

        this._model = "Library";
        this._title = this.name;

    }

    authors?: Author[];
    series?: Series[];
    stories?: Story[];
    volumes?: Volume[];

    _model: string;
    _title: string;

}

export default Library;
