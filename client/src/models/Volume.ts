// Volume --------------------------------------------------------------------

// Physical or electronic published unit, written by one or more Authors,
// and containing one or more Stories.

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import Library from "./Library";
import Story from "./Story";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const VOLUMES_BASE = "/volumes";

export class VolumeData {

    constructor(data: any = {}) {
        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.copyright = data.copyright ? data.copyright : null;
        this.googleId = data.googleId ? data.googleId : null;
        this.isbn = data.isbn ? data.isbn : null;
        this.libraryId = data.libraryId ? data.libraryId : -1;
        this.location = data.location ? data.location : null;
        this.name = data.name ? data.name : null;
        this.notes = data.notes ? data.notes : null;
        this.read = (data.read !== undefined) ? data.read : false;
        this.type = data.type ? data.type : "Single";
    }

    id: number;
    active: boolean;
    copyright: string;
    googleId: string;
    isbn: string;
    libraryId: number;
    location: string;
    name: string;
    notes: string;
    read: boolean;
    type: string;

}

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

    _model: string;
    _title: string;

}

export default Volume;
