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
        this.principal = this.calculatePrincipal(data);

    }

    id: number;
    active: boolean;
    firstName: string;
    lastName: string;
    libraryId: number;
    notes: string;
    principal: boolean;

    private calculatePrincipal(data: any): boolean {
        if (data.principal !== undefined) {
            return data.principal;
        } else if (data.AuthorSeries && (data.AuthorSeries.principal !== undefined)) {
            return data.AuthorSeries.principal;
        } else if (data.AuthorStory && (data.AuthorStory.principal !== undefined)) {
            return data.AuthorStory.principal;
        } else if (data.AuthorVolume && (data.AuthorVolume.principal !== undefined)) {
            return data.AuthorVolume.principal;
        } else {
            return false;
        }
    }

}

export default AuthorData;
