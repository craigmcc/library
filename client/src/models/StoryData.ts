// StoryData -----------------------------------------------------------------

// Fields from a Story that might be visible in an input form.

// Public Objects ------------------------------------------------------------

class StoryData {

    constructor(data: any = {}) {
        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.copyright = data.copyright ? data.copyright : null;
        this.libraryId = data.libraryId ? data.libraryId : -1;
        this.name = data.name ? data.name : null;
        this.notes = data.notes ? data.notes : null;
        this.ordinal = this.calculateOrdinal(data);
    }

    id: number;
    active: boolean;
    copyright: string;
    libraryId: number;
    name: string;
    notes: string;
    ordinal: number;

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

export default StoryData;
