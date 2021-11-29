// LibraryData ---------------------------------------------------------------

// Fields from a Library that might be visible in an input form.

// Public Objects ------------------------------------------------------------

class LibraryData {

    constructor(data: any = {}) {
        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.name = data.name ? data.name : null;
        this.notes = data.notes ? data.notes : null;
        this.scope = data.scope ? data.scope : null;
    }

    id: number;
    active: boolean;
    name: string;
    notes: string;
    scope: string;

}

export default LibraryData;
