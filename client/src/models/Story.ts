// Story ---------------------------------------------------------------------

// Individual story or novel, may be a participant in one or more Series,
// published in one or more Volumes, and written by one or more Authors.

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import Library from "./Library";
import Model from "./Model";
import Series from "./Series";
import Volume from "./Volume";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const STORIES_BASE = "/stories";

export class StoryData extends Model<Story> {

    constructor(data: any = {}) {
        super();
        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.copyright = data.copyright ? data.copyright : null;
        this.libraryId = data.libraryId ? data.libraryId : -1;
        this.name = data.name ? data.name : null;
        this.notes = data.notes ? data.notes : null;
        this.ordinal = 0;
        if (data.ordinal) {
            this.ordinal = data.ordinal;
        } else if (data.SeriesStory && data.SeriesStory.ordinal) {
            this.ordinal = data.SeriesStory.ordinal;
        }
    }

    id: number;
    active: boolean;
    copyright: string;
    libraryId: number;
    name: string;
    notes: string;
    ordinal: number;

}

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
