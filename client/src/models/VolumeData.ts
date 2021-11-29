// VolumeData ----------------------------------------------------------------

// Fields from a Volume that might be visible in an input form.

// Public Objects ------------------------------------------------------------

class VolumeData {

    constructor(data: any = {}) {

        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.copyright = data.copyright ? data.copyright : null;
        this.googleId = data.googleId ? data.googleId : null;
        this.isbn = data.isbn ? data.isbn : null;
        this.libraryId = data.libraryId ? data.libraryId : -1;
        this.location = data.location ? data.location : -1;
        this.name = data.name ? data.name : null;
        this.notes = data.notes ? data.notes : null;
        this.read = (data.read !== undefined) ? data.read : false;
        this.type = data.type ? data.type : "Single";

    }

    id!: number;
    active!: boolean;
    copyright?: string;
    googleId?: string;
    isbn?: string;
    libraryId!: number;
    location?: string;
    name!: string;
    notes?: string;
    read!: boolean;
    type!: string;

}

export default VolumeData;
