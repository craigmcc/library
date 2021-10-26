// SeriesServices.test ------------------------------------------------------

// Functional tests for SeriesServices.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import SeriesServices from "./SeriesServices";
import Series from "../models/Series";
import * as SeedData from "../test/SeedData";
import ServicesUtils from "../test/ServicesUtils";
import {BadRequest, NotFound} from "../util/HttpErrors";

const UTILS = new ServicesUtils();

// Test Specifications ------------------------------------------------------

describe("SeriesServices Functional Tests", () => {

    // Test Hooks -----------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await UTILS.loadData({
            withAuthors: true,
            withLibraries: true,
            withSeries: true,
            withStories: true,
        });
    })

    // Test Methods ---------------------------------------------------------

    describe("SeriesServices.all()", () => {

        it("should pass on active Series", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const series = await SeriesServices.all(library.id, {
                active: "",
            });

            expect(series.length).to.be.lessThanOrEqual(SeedData.SERIES_LIBRARY0.length);
            series.forEach(series => {
                expect(series.active).to.be.true;
                expect(series.libraryId).to.equal(library.id);
            });

        });

        it("should pass on all Series", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const series = await SeriesServices.all(library.id);

            expect(series.length).to.equal(SeedData.SERIES_LIBRARY1.length);
            series.forEach(series => {
                expect(series.libraryId).to.equal(library.id);
            })

        })

        it("should passed on name'd Series", async () => {

            const NAME = "tT"; // Should match "Betty Series"
            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const series = await SeriesServices.all(library.id, {
                name: NAME,
            });

            expect(series.length).to.equal(1);
            series.forEach(series => {
                expect(series.libraryId).to.equal(library.id);
                expect(series.name.toLowerCase()).to.include(NAME.toLowerCase());
            })

        })

    })

    describe.skip("SeriesServices.authors()", () => {
        // TODO
    })

    describe("SeriesServices.exact()", () => {

        it("should fail on invalid name", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST)
            const INVALID_NAME = "INVALID VOLUME NAME";

            try {
                await SeriesServices.exact(library.id, INVALID_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes
                    (`Missing Series '${INVALID_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on valid names", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);

            SeedData.SERIES_LIBRARY1.forEach(async series => {
                try {
                    const name = series.name ? series.name : "can not happen";
                    await SeriesServices.exact(library.id, name);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            })

        })

    })

    describe("SeriesServices.find()", () => {

        it("should fail on invalid ID", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INVALID_ID = 9999;

            try {
                await SeriesServices.find(library.id, INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`seriesId: Missing Series ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on included children", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const serieses = await SeriesServices.all(library.id, {
                withAuthors: "",
                withLibrary: "",
                withStories: "",
            });
            expect(serieses.length).to.be.greaterThan(0);

            serieses.forEach(series => {
                expect(series.libraryId).to.equal(library.id);
                expect(series.library).to.exist;
                expect(series.library.id).to.equal(library.id);
                // TODO - check series.authors when available
                expect(series.stories).to.exist;
                series.stories.forEach(story => {
                    expect(story.libraryId).to.equal(library.id);
                    expect(story.SeriesStory).to.exist;
                    expect(story.SeriesStory.ordinal).to.exist;
                    expect(story.SeriesStory.ordinal).to.be.greaterThan(0);
                })
            })

        })

        it("should pass on valid IDs", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS = await SeriesServices.all(library.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await SeriesServices.find(library.id, INPUT.id);
                compareSeriesOld(OUTPUT, INPUT);
            })

        })

    })

    describe("SeriesServices.insert()", () => {

        it("should fail on duplicate data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS = await SeriesServices.all(library.id);
            const INPUT = {
                name: INPUTS[0].name,
            };

            try {
                await SeriesServices.insert(library.id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include
                    (`name: Name '${INPUT.name}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should fail on missing data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const INPUT = {};

            try {
                await SeriesServices.insert(library.id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("name: Is required");
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on valid data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INPUT = {
                active: true,
                copyright: "2021",
                libraryId: library.id,
                name: "Valid Name",
            }

            const OUTPUT = await SeriesServices.insert(library.id, INPUT);
            compareSeriesNew(OUTPUT, INPUT);

        })

    })

    describe("SeriesServices.remove()", () => {

        it("should fail on invalid ID", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INVALID_ID = -1;

            try {
                await SeriesServices.remove(library.id, INVALID_ID);
                expect.fail(`Should have thrown NotFound`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`seriesId: Missing Series ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on valid ID", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const serieses = await SeriesServices.all(library.id);
            const VALID_ID = serieses[0].id;

            const series = await SeriesServices.remove(library.id, VALID_ID);
            expect(series.id).to.equal(VALID_ID);

            try {
                await SeriesServices.remove(library.id, VALID_ID);
                expect.fail("Should have thrown NotFound after remove");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`seriesId: Missing Series ${VALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

    })

    describe("SeriesServices.stories()", () => {

        it("should pass on active stories", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const SERIES_NAME: string = SeedData.SERIES_LIBRARY0[0].name
                ? SeedData.SERIES_LIBRARY0[0].name : "can not happen";
            const series = await SeriesServices.exact(library.id, SERIES_NAME);

            const stories = await SeriesServices.stories(library.id, series.id, {
                active: "",
            });
            stories.forEach(story => {
                expect(story.active).to.be.true;
                expect(story.libraryId).to.equal(library.id);
            })

        })

        it("should pass on all stories", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const SERIES_NAME: string = SeedData.SERIES_LIBRARY1[1].name
                ? SeedData.SERIES_LIBRARY1[1].name : "can not happen";
            const series = await SeriesServices.exact(library.id, SERIES_NAME);

            const stories = await SeriesServices.stories(library.id, series.id);
            stories.forEach(story => {
                expect(story.libraryId).to.equal(library.id);
            })

        })

        it("should pass on name'd stories", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const SERIES_NAME: string = SeedData.SERIES_LIBRARY0[1].name
                ? SeedData.SERIES_LIBRARY0[1].name : "can not happen";
            const series = await SeriesServices.exact(library.id, SERIES_NAME);
            const NAME_PATTERN = "I"; // Should match "Wilma" and "Flintstone"

            const stories = await SeriesServices.stories(library.id, series.id, {
                name: NAME_PATTERN,
            });
            stories.forEach(story => {
                expect(story.libraryId).to.equal(library.id);
                expect(story.name.toLowerCase()).to.include(NAME_PATTERN.toLowerCase());
            })

        })

    })

    describe("SeriesServices.update()", () => {

        it("should fail on duplicate data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const series = await SeriesServices.all(library.id);
            const INPUT = {
                name: series[0].name,
            }

            try {
                await SeriesServices.update(library.id, series[1].id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include
                    (`name: Name '${INPUT.name}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should fail on invalid ID", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INPUT = {};
            const INVALID_ID = -1;

            try {
                await SeriesServices.update(library.id, INVALID_ID, INPUT);
                expect.fail(`Should have thrown NotFound`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`seriesId: Missing Series ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on no changes data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const series = await SeriesServices.all(library.id);
            const INPUT = series[0];

            const OUTPUT = await SeriesServices.update(library.id, INPUT.id, INPUT);
            compareSeriesOld(OUTPUT, INPUT);
            const UPDATED = await SeriesServices.find(library.id, INPUT.id);
            compareSeriesOld(UPDATED, OUTPUT);

        })

        it("should pass on no updates data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const series = await SeriesServices.all(library.id);
            const INPUT = {};
            const VALID_ID = series[0].id

            const OUTPUT = await SeriesServices.update(library.id, VALID_ID, INPUT);
            compareSeriesOld(OUTPUT, INPUT);
            const UPDATED = await SeriesServices.find(library.id, VALID_ID);
            compareSeriesOld(UPDATED, OUTPUT);

        })

        it("should pass on valid updates data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const series = await SeriesServices.all(library.id);
            const INPUT = {
                active: false,
                copyright: "1984",
                name: "New Name",
                type: "Collection",
            };
            const VALID_ID = series[0].id

            const OUTPUT = await SeriesServices.update(library.id, VALID_ID, INPUT);
            compareSeriesOld(OUTPUT, INPUT);
            const UPDATED = await SeriesServices.find(library.id, VALID_ID);
            compareSeriesOld(UPDATED, OUTPUT);

        })

    })

})

// Helper Objects -----------------------------------------------------------

export function compareSeriesNew(OUTPUT: Partial<Series>, INPUT: Partial<Series>) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.copyright).to.equal(INPUT.copyright ? INPUT.copyright : null);
    expect(OUTPUT.libraryId).to.equal(INPUT.libraryId );
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
}

export function compareSeriesOld(OUTPUT: Partial<Series>, INPUT: Partial<Series>) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.copyright).to.equal(INPUT.copyright ? INPUT.copyright : OUTPUT.copyright);
    expect(OUTPUT.libraryId).to.equal(INPUT.libraryId ? INPUT.libraryId : OUTPUT.libraryId);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
}

