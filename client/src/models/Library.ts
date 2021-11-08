// Library -------------------------------------------------------------------

// Overall collection of Authors, Series, Stories, and Volumes.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import Series from "./Series";
import Story from "./Story";
import Volume from "./Volume";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const LIBRARIES_BASE = "/libraries";

class Library {

    constructor(data: any = {}) {

        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.name = data.name ? data.name : null;
        this.notes = data.notes ? data.notes : null;
        this.scope = data.scope ? data.scope : null;

        this.authors = data.authors ? ToModel.AUTHORS(data.authors) : [];
        this.series = data.series ? ToModel.SERIESES(data.series) : [];
        this.stories = data.stories ? ToModel.STORIES(data.stories) : [];
        this.volumes = data.volumes ? ToModel.VOLUMES(data.volumes) : [];

        this._model = this.constructor.name;
        this._title = this.name;

    }

    id!: number;
    active!: boolean;
    name!: string;
    notes?: string;
    scope!: string;

    authors!: Author[];
    series!: Series[];
    stories!: Story[];
    volumes!: Volume[];

    _model!: string;
    _title!: string;

}

export default Library;
