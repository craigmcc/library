// Story ---------------------------------------------------------------------

// Individual story or novel, may be a participant in one or more Series,
// published in one or more Volumes, and written by one or more Authors.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import Library from "./Library";
import Series from "./Series";
import Volume from "./Volume";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const STORIES_BASE = "/stories";

class Story {

    constructor(data: any = {}) {

        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.copyright = data.copyright ? data.copyright : null;
        this.libraryId = data.libraryId ? data.libraryId : -1;
        this.name = data.name ? data.name : null;
        this.notes = data.notes ? data.notes : null;
        this.ordinal = this.calculateOrdinal(data);

        this.authors = data.authors ? ToModel.AUTHORS(data.authors) : undefined;
        this.library = data.library ? ToModel.LIBRARY(data.library) : undefined;
        this.series = data.series ? ToModel.SERIESES(data.series) : undefined;
        this.volumes = data.volumes ? ToModel.VOLUMES(data.volumes) : undefined;

        this._model = "Story";
        this._title = this.name;

    }

    id!: number;
    active!: boolean;
    copyright?: string;
    libraryId!: number;
    name!: string;
    notes?: string;
    ordinal!: number;

    authors?: Author[];
    library?: Library;
    series?: Series[];
    volumes?: Volume[];

    _model!: string;
    _title!: string;

    private calculateOrdinal(data: any): number {
        if (data.ordinal) {
            return data.ordinal;
        } else if (data.SeriesStory && data.SeriesStory.ordinal) {
            return data.SeriesStory.ordinal;
        } else {
            return 0;
        }
    }

}

export default Story;
