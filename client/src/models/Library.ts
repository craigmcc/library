// Library -------------------------------------------------------------------

// Overall collection of Authors, Series, Stories, and Volumes.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export const LIBRARIES_BASE = "/libraries";

class Library {

    constructor(data: any = {}) {

        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.name = data.name ? data.name : null;
        this.notes = data.notes ? data.notes : null;
        this.scope = data.scope ? data.scope : null;

        // TODO: children

    }

    id!: number;
    active!: boolean;
    name!: string;
    notes?: string;
    scope!: string;

    // TODO: children

}

export default Library;
