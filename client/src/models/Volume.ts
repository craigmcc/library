// Volume --------------------------------------------------------------------

// Physical or electronic published unit, written by one or more Authors,
// and containing one or more Stories.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import Library from "./Library";
import Story from "./Story";
import * as ToModel from "../util/ToModel";
import VolumeData from "./VolumeData";

// Public Objects ------------------------------------------------------------

export const VOLUMES_BASE = "/volumes";

class Volume extends VolumeData {

    constructor(data: any = {}) {

        super(data);

        this.authors = data.authors ? ToModel.AUTHORS(data.authors) : undefined;
        this.library = data.library ? ToModel.LIBRARY(data.library) : undefined;
        this.stories = data.stories ? ToModel.STORIES(data.stories) : undefined;

        this._model = "Volume";
        this._title = this.name;

    }

    authors?: Author[];
    library?: Library;
    stories?: Story[];

    _model!: string;
    _title!: string;

}

export default Volume;
