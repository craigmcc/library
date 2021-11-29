// SeriesData ----------------------------------------------------------------

// Fields from a Series that might be visible in an input form.

// Public Objects ------------------------------------------------------------

class SeriesData {

    constructor(data: any = {}) {
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

export default SeriesData;
