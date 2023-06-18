// actions/StoryActions.test.ts

/**
 * Functional tests for StoryActions
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;
import {
    Author,
    Library,
    Prisma,
    Series,
    Story,
    Volume,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "./LibraryActions";
import * as StoryActions from "./StoryActions";
import * as BaseUtils from "../test-prisma/BaseUtils";
import * as SeedData from "../test-prisma/SeedData";
import {BadRequest, NotFound, NotUnique} from "../util/HttpErrors";

// Test Specifications -------------------------------------------------------

describe("StoryActions Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await BaseUtils.loadData({
            withAuthors: true,
            withLibraries: true,
            withSeries: true,
            withStories: true,
            withVolumes: true,
        });
    });

    // Test Methods ----------------------------------------------------------

    describe("StoryActions.all()", () => {

        it("should pass on active Stories", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS =
                await StoryActions.all(LIBRARY.id, { active: "" });
            for (const INPUT of INPUTS) {
                expect(INPUT.active).to.be.true;
            }
        });

        it("should pass on all Stories", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS =
                await StoryActions.all(LIBRARY.id);
            expect(INPUTS.length).to.equal(SeedData.STORIES_LIBRARY1.length);
        });

        it("should pass on parent Library", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS =
                await StoryActions.all(LIBRARY.id, {
                    withLibrary: "",
                });
            expect(INPUTS.length).to.be.greaterThan(0);
            for (const INPUT of INPUTS) {
                expect(INPUT.library).to.exist;
                expect(INPUT.library.id).to.equal(LIBRARY.id);
            }
        });

        it("should pass on named Stories", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const PATTERN = "tT";
            const OUTPUTS =
                await StoryActions.all(LIBRARY.id, { name: PATTERN });
            expect(OUTPUTS.length).to.be.greaterThan(0);
            for (const OUTPUT of OUTPUTS) {
                expect(OUTPUT.name.toLowerCase()).to.include(PATTERN.toLowerCase());
            }
        });

        it("should pass on paginated Stories", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const LIMIT = 99;
            const OFFSET = 1;
            const INPUTS = await StoryActions.all(LIBRARY.id);
            const OUTPUTS = await StoryActions.all(LIBRARY.id, {
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(OUTPUTS.length).to.equal(SeedData.STORIES_LIBRARY0.length - 1);
            OUTPUTS.forEach((OUTPUT, index) =>  {
                compareStoryOld(OUTPUT, INPUTS[index + OFFSET]);
            });
        });

    });

    describe("StoryActions.exact()", () => {

        it("should fail on invalid name", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INVALID_NAME = "INVALID STORY NAME";
            try {
                await StoryActions.exact(LIBRARY.id, INVALID_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`Missing Story '${INVALID_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        })

        it("should pass on valid names", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS = await StoryActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await StoryActions.exact(LIBRARY.id, INPUT.name);
                    expect(OUTPUT.name).to.equal(INPUT.name);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

    describe("StoryActions.find()", () => {

        it("should fail on invalid ID", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INVALID_ID = 9999;
            try {
                await StoryActions.find(LIBRARY.id, INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`id: Missing Story ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        })

        it("should pass on included parent", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS = await StoryActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await StoryActions.find(LIBRARY.id, INPUT.id, {
                            withLibrary: "",
                        });
                    expect(OUTPUT.library).to.exist;
                    expect(OUTPUT.library.id).to.equal(LIBRARY.id);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid ids", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS =
                await StoryActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await StoryActions.find(LIBRARY.id, INPUT.id);
                    compareStoryOld(OUTPUT, INPUT);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

});

// Private Objects -----------------------------------------------------------

export function compareStoryNew(OUTPUT: Story, INPUT: Story) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.copyright).to.equal(INPUT.copyright ? INPUT.copyright : null);
    expect(OUTPUT.libraryId).to.equal(INPUT.libraryId);
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
}

export function compareStoryOld(OUTPUT: Story, INPUT: Story) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.copyright).to.equal(INPUT.copyright ? INPUT.copyright : OUTPUT.copyright);
    expect(OUTPUT.libraryId).to.equal(INPUT.libraryId ? INPUT.libraryId : OUTPUT.libraryId);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
}
