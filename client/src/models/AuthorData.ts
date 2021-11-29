// AuthorData ----------------------------------------------------------------

// Fields from an Author that might be visible in an input form.

// Public Objects ------------------------------------------------------------

class AuthorData {

    constructor (data: any = {}) {
        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.firstName = data.firstName ? data.firstName : null;
        this.lastName = data.lastName ? data.lastName : null;
        this.libraryId = data.libraryId ? data.libraryId : -1;
        this.notes = data.notes;
        this.principal = false;
        if (data.principal !== undefined) {
            this.principal = data.principal;
        } else if (data.AuthorSeries && (data.AuthorSeries.principal !== undefined)) {
            this.principal = data.AuthorSeries.principal;
        } else if (data.AuthorStory && (data.AuthorStory.principal !== undefined)) {
            this.principal = data.AuthorStory.principal;
        } else if (data.AuthorVolume && (data.AuthorVolume.principal !== undefined)) {
            this.principal = data.AuthorVolume.principal;
        }
    }

    id: number;
    active: boolean;
    firstName: string;
    lastName: string;
    libraryId: number;
    notes: string;
    principal: boolean;

}

export default AuthorData;
