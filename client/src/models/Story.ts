// Story ---------------------------------------------------------------------

// Individual story or novel, may be a participant in one or more Series,
// published in one or more Volumes, and written by one or more Authors.

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import Library from "./Library";
import Series from "./Series";
import StoryData from "./StoryData";
import Volume from "./Volume";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const STORIES_BASE = "/stories";

class Story extends StoryData {

    constructor(data: any = {}) {

        super(data);

        this.authors = data.authors ? ToModel.AUTHORS(data.authors) : undefined;
        this.library = data.library ? ToModel.LIBRARY(data.library) : undefined;
        this.series = data.series ? ToModel.SERIESES(data.series) : undefined;
        this.volumes = data.volumes ? ToModel.VOLUMES(data.volumes) : undefined;

        this._model = "Story";
        this._title = this.name;

    }

    authors?: Author[];
    library?: Library;
    series?: Series[];
    volumes?: Volume[];

    _model: string;
    _title: string;

}

export default Story;
