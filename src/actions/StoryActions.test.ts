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

import * as AuthorActions from "./AuthorActions";
import * as LibraryActions from "./LibraryActions";
import * as StoryActions from "./StoryActions";
import * as BaseUtils from "../test-prisma/BaseUtils";
import * as SeedData from "../test-prisma/SeedData";
import {NotFound, NotUnique} from "../util/HttpErrors";

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

        it("should pass on included parent", async () => {
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

        it("should pass on included relations", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS = await StoryActions.all(LIBRARY.id, {
                withAuthors: "",
                withSeries: "",
                withVolumes: "",
            });
            for (const INPUT of INPUTS) {
                try {
                    //console.log("STORY", INPUT);
                    expect(INPUT.authorsStories).to.exist;
                    expect(INPUT.seriesStories).to.exist;
                    expect(INPUT.volumesStories).to.exist;
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
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

    describe("StoryActions.authorConnect()", () => {

        it("should fail on connecting twice", async () => {
            // Set up LIBRARY, AUTHOR, and STORY
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const AUTHOR =
                await AuthorActions.insert(LIBRARY.id, {
                    firstName: "Test First",
                    lastName: "Test Last",
                    libraryId: LIBRARY.id,
                });
            const STORY =
                await StoryActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Story",
                });
            // Perform the authorConnect() action once
            try {
                await StoryActions.authorConnect(LIBRARY.id, STORY.id, AUTHOR.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Attempt to perform the action again
            try {
                await StoryActions.authorConnect(LIBRARY.id, STORY.id, AUTHOR.id, true);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                        (`connect: Author ID ${AUTHOR.id} and Story ID ${STORY.id} are already connected`);
                } else {
                    expect.fail(`Should not have thrown '${error}`);
                }
            }
        });

        it("should pass on valid data", async () => {
            // Set up LIBRARY, AUTHOR, and STORY
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const AUTHOR =
                await AuthorActions.insert(LIBRARY.id, {
                    firstName: "Test First",
                    lastName: "Test Last",
                    libraryId: LIBRARY.id,
                });
            const STORY =
                await StoryActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Story",
                });
            // Perform the authorConnect() action
            try {
                await StoryActions.authorConnect(LIBRARY.id, STORY.id, AUTHOR.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that the connection is represented correctly
            const OUTPUT =
                await StoryActions.find(LIBRARY.id, STORY.id, {
                    withAuthors: true,
                });
            expect(OUTPUT.authorsStories).to.exist;
            const AUTHORS_STORIES = OUTPUT.authorsStories as AuthorActions.AuthorsStoriesPlus[];
            expect(AUTHORS_STORIES.length).to.equal(1);
            expect(AUTHORS_STORIES[0].authorId).to.equal(AUTHOR.id);
            expect(AUTHORS_STORIES[0].author).to.exist;
            expect(AUTHORS_STORIES[0].story.id).to.equal(STORY.id);
            expect(AUTHORS_STORIES[0].story).to.exist;
        });

    });

    describe("StoryActions.authorDisconnect()", () => {

        it("should fail on disconnecting twice", async () => {
            // Set up LIBRARY, AUTHOR, and STORY
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const AUTHOR =
                await AuthorActions.insert(LIBRARY.id, {
                    firstName: "Test First",
                    lastName: "Test Last",
                    libraryId: LIBRARY.id,
                });
            const STORY =
                await StoryActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Story",
                });
            // Perform the authorConnect() action
            try {
                await StoryActions.authorConnect(LIBRARY.id, STORY.id, AUTHOR.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Perform the authorDisconnect() action
            try {
                await StoryActions.authorDisconnect(LIBRARY.id, STORY.id, AUTHOR.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that disconnecting twice fails
            try {
                await StoryActions.authorDisconnect(LIBRARY.id, STORY.id, AUTHOR.id);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`disconnect: Author ID ${AUTHOR.id} and Story ID ${STORY.id} are not connected`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid data", async () => {
            // Set up LIBRARY, AUTHOR, and STORY
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const AUTHOR =
                await AuthorActions.insert(LIBRARY.id, {
                    firstName: "Test First",
                    lastName: "Test Last",
                    libraryId: LIBRARY.id,
                });
            const STORY =
                await StoryActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Story",
                });
            // Perform the authorConnect() action
            try {
                await StoryActions.authorConnect(LIBRARY.id, STORY.id, AUTHOR.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Perform the authorDisconnect() action
            try {
                await StoryActions.authorDisconnect(LIBRARY.id, STORY.id, AUTHOR.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that the disconnect occurred
            const OUTPUT = await StoryActions.find(LIBRARY.id, STORY.id, {
                withAuthors: true,
            });
            expect(OUTPUT.authorsStories).to.exist;
            expect(OUTPUT.authorsStories.length).to.equal(0);
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

        it("should pass on included parent", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS = await StoryActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await StoryActions.exact(LIBRARY.id, INPUT.name, {
                            withLibrary: "",
                        });
                    expect(OUTPUT.library).to.exist;
                    expect(OUTPUT.library.id).to.equal(LIBRARY.id);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on included relations", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS = await StoryActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await StoryActions.exact(LIBRARY.id, INPUT.name, {
                            withAuthors: "",
                            withSeries: "",
                            withVolumes: "",
                        });
                    //console.log("STORY", OUTPUT);
                    expect(OUTPUT.authorsStories).to.exist;
                    expect(OUTPUT.seriesStories).to.exist;
                    expect(OUTPUT.volumesStories).to.exist;
                    if (OUTPUT.name !== "Rubble Story") { // Quirk of seed data
                        expect(OUTPUT.authorsStories.length).to.be.greaterThan(0);
                        expect(OUTPUT.seriesStories.length).to.be.greaterThan(0);
                        expect(OUTPUT.volumesStories.length).to.be.greaterThan(0);
                    }
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

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

        it("should pass on included relations", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS = await StoryActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await StoryActions.find(LIBRARY.id, INPUT.id, {
                            withAuthors: "",
                            withSeries: "",
                            withVolumes: "",
                        });
                    //console.log("STORY", OUTPUT);
                    expect(OUTPUT.authorsStories).to.exist;
                    expect(OUTPUT.seriesStories).to.exist;
                    expect(OUTPUT.volumesStories).to.exist;
                    if (OUTPUT.name !== "Rubble Story") { // Quirk of seed data
                        expect(OUTPUT.authorsStories.length).to.be.greaterThan(0);
                        expect(OUTPUT.seriesStories.length).to.be.greaterThan(0);
                        expect(OUTPUT.volumesStories.length).to.be.greaterThan(0);
                    }
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

    describe("StoryActions.insert()", () => {

        it("should fail on duplicate name", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withStories: true,
                });
            const INPUT: Prisma.StoryUncheckedCreateInput = {
                libraryId: -1,          // Will get replaced
                name: LIBRARY.stories[0].name,
            }
            try {
                await StoryActions.insert(LIBRARY.id, INPUT);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                        (`name: Story name '${INPUT.name}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid input data", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND, {
                    withStories: "",
                });
            const INPUT: Prisma.StoryUncheckedCreateInput = {
                active: false,
                copyright: "2023",
                libraryId: -1,          // Will get replaced
                name: LIBRARY.stories[0].name + " NEW",
                notes: "Valid notes",
            }
            try {
                const OUTPUT =
                    await StoryActions.insert(LIBRARY.id, INPUT);
                compareStoryNew(OUTPUT, INPUT as Story, LIBRARY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        });

    });

    describe("StoryActions.remove()", () => {

        it("should fail on invalid library ID", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withStories: true,
                });
            const INVALID_LIBRARY_ID = -1;
            const VALID_STORY_ID = LIBRARY.stories[0].id;
            try {
                await StoryActions.remove(INVALID_LIBRARY_ID, VALID_STORY_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                expect((error as Error).message).to.include
                    (`id: Missing Story ${VALID_STORY_ID}`);
            }
        });

        it("should fail on invalid story ID", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withStories: true,
                });
            const VALID_LIBRARY_ID = LIBRARY.id;
            const INVALID_STORY_ID = -1;
            try {
                await StoryActions.remove(VALID_LIBRARY_ID, INVALID_STORY_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                expect((error as Error).message).to.include
                    (`id: Missing Story ${INVALID_STORY_ID}`);
            }
        });

        it("should pass on valid IDs", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND, {
                    withStories: true,
                });
            const INPUT = LIBRARY.stories[0];
            const OUTPUT = await StoryActions.remove(LIBRARY.id, INPUT.id);
            try {
                await StoryActions.remove(LIBRARY.id, INPUT.id);
                expect.fail("Should have thrown NotFound after remove");
            } catch (error) {
                expect((error as Error).message).to.include
                    (`id: Missing Story ${INPUT.id}`);
            }
        });

    });

    describe("StoryActions.update()", () => {

        it("should fail on duplicate name", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withStories: true,
                });
            const ORIGINAL =
                await StoryActions.find(LIBRARY.id, LIBRARY.stories[0].id);
            const INPUT: Prisma.StoryUncheckedUpdateInput = {
                name: LIBRARY.stories[1].name,
            }
            try {
                await StoryActions.update(LIBRARY.id, ORIGINAL.id, INPUT);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                expect((error as Error).message).to.include
                    (`name: Story name '${INPUT.name}' is already in use`);
            }
        });

        it("should pass on no change update", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND, {
                    withStories: true,
                });
            const INPUT = LIBRARY.stories[0];
            const UPDATE: Prisma.StoryUncheckedUpdateInput = {
                active: INPUT.active,
                copyright: INPUT.copyright,
                name: INPUT.name,
                notes: INPUT.notes,
            }
            try {
                const OUTPUT =
                    await StoryActions.update(LIBRARY.id, INPUT.id, UPDATE);
                compareStoryOld(OUTPUT, INPUT);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        });

        it("should pass on no data update", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withStories: true,
                });
            const INPUT = LIBRARY.stories[0];
            const UPDATE: Prisma.StoryUncheckedUpdateInput = {};
            try {
                const OUTPUT =
                    await StoryActions.update(LIBRARY.id, INPUT.id, UPDATE);
                compareStoryOld(OUTPUT, INPUT);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        });

        it("should pass on valid change update", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND, {
                    withStories: true,
                });
            const INPUT = LIBRARY.stories[0];
            const UPDATE: Prisma.StoryUncheckedUpdateInput = {
                active: INPUT.active ? !INPUT.active : undefined,
                copyright: INPUT.copyright ? (INPUT.copyright + " NEW") : undefined,
                name: INPUT.name + " NEW",
                notes: INPUT.notes ? (INPUT.notes + " NEW") : undefined,
            }
            try {
                const OUTPUT =
                    await StoryActions.update(LIBRARY.id, INPUT.id, UPDATE);
                compareStoryOld(OUTPUT, UPDATE as Story);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        });

    });

});

// Private Objects -----------------------------------------------------------

export function compareStoryNew(OUTPUT: Story, INPUT: Story, libraryId: number) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.copyright).to.equal(INPUT.copyright ? INPUT.copyright : null);
    expect(OUTPUT.libraryId).to.equal(libraryId);
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

