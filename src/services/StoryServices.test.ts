// StoryServices.test ------------------------------------------------------

// Functional tests for StoryServices.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import StoryServices from "./StoryServices";
import Story from "../models/Story";
import * as SeedData from "../test/SeedData";
import ServicesUtils from "../test/ServicesUtils";
import {BadRequest, NotFound} from "../util/HttpErrors";

const UTILS = new ServicesUtils();

// Test Specifications ------------------------------------------------------

describe("StoryServices Functional Tests", () => {

    // Test Hooks -----------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await UTILS.loadData({
            withAuthors: true,
            withLibraries: true,
            withSeries: true,
            withStories: true,
            withVolumes: true,
        });
    })

    // Test Methods ---------------------------------------------------------

    describe("StoryServices.all()", () => {

        it("should pass on active Stories", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const stories = await StoryServices.all(library.id, {
                active: "",
            });

            expect(stories.length).to.be.lessThanOrEqual(SeedData.STORIES_LIBRARY0.length);
            stories.forEach(story => {
                expect(story.active).to.be.true;
                expect(story.libraryId).to.equal(library.id);
            });

        });

        it("should pass on all Stories", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const stories = await StoryServices.all(library.id);

            expect(stories.length).to.equal(SeedData.STORIES_LIBRARY1.length);
            stories.forEach(story => {
                expect(story.libraryId).to.equal(library.id);
            })

        })

        it("should passed on name'd Stories", async () => {

            const NAME = "tT"; // Should match "Betty Story"
            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const stories = await StoryServices.all(library.id, {
                name: NAME,
            });

            expect(stories.length).to.equal(1);
            stories.forEach(story => {
                expect(story.libraryId).to.equal(library.id);
                expect(story.name.toLowerCase()).to.include(NAME.toLowerCase());
            })

        })

    })

    describe("StoryServices.authors()", () => {

        it("should pass on active Authors", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const STORY_NAME: string = SeedData.STORIES_LIBRARY0[0].name
                ? SeedData.STORIES_LIBRARY0[0].name : "can not happen";
            const story = await StoryServices.exact(library.id, STORY_NAME);

            const authors = await StoryServices.authors(library.id, story.id, {
                active: "",
            });
            authors.forEach(author => {
                expect(author.active).to.be.true;
                expect(author.libraryId).to.equal(library.id);
            })

        })

        it("should pass on all Authors", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const STORY_NAME: string = SeedData.STORIES_LIBRARY1[1].name
                ? SeedData.STORIES_LIBRARY1[1].name : "can not happen";
            const story = await StoryServices.exact(library.id, STORY_NAME);

            const authors = await StoryServices.authors(library.id, story.id);
            authors.forEach(author => {
                expect(author.libraryId).to.equal(library.id);
            })

        })

        it("should pass on name'd Authors", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const STORY_NAME: string = SeedData.STORIES_LIBRARY0[1].name
                ? SeedData.STORIES_LIBRARY0[1].name : "can not happen";
            const story = await StoryServices.exact(library.id, STORY_NAME);
            const NAME_PATTERN = "I"; // Should match "Wilma" and "Flintstone"

            const authors = await StoryServices.authors(library.id, story.id, {
                name: NAME_PATTERN,
            });
            authors.forEach(author => {
                expect(author.libraryId).to.equal(library.id);
            })

        })

    })

    describe("StoryServices.exact()", () => {

        it("should fail on invalid name", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST)
            const INVALID_NAME = "INVALID VOLUME NAME";

            try {
                await StoryServices.exact(library.id, INVALID_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes
                        (`Missing Story '${INVALID_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on valid names", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);

            SeedData.STORIES_LIBRARY1.forEach(async story => {
                try {
                    const name = story.name ? story.name : "can not happen";
                    await StoryServices.exact(library.id, name);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            })

        })

    })

    describe("StoryServices.find()", () => {

        it("should fail on invalid ID", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INVALID_ID = 9999;

            try {
                await StoryServices.find(library.id, INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                        (`storyId: Missing Story ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on included children", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const stories = await StoryServices.all(library.id, {
                withAuthors: "",
                withLibrary: "",
                withVolumes: "",
            });
            expect(stories.length).to.be.greaterThan(0);

            stories.forEach(story => {
                expect(story.libraryId).to.equal(library.id);
                expect(story.library).to.exist;
                expect(story.library.id).to.equal(library.id);
                expect(story.authors).to.exist;
                story.authors.forEach(author => {
                    expect(author.libraryId).to.equal(library.id);
                    expect(author.AuthorStory).to.exist;

                })
                expect(story.volumes).to.exist;
                story.volumes.forEach(volume => {
                    expect(volume.libraryId).to.equal(library.id);
                    expect(volume.VolumeStory).to.exist;
                })
            })

        })

        it("should pass on valid IDs", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS = await StoryServices.all(library.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await StoryServices.find(library.id, INPUT.id);
                compareStoryOld(OUTPUT, INPUT);
            })

        })

    })

    describe("StoryServices.insert()", () => {

        it("should fail on duplicate data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS = await StoryServices.all(library.id);
            const INPUT = {
                name: INPUTS[0].name,
            };

            try {
                await StoryServices.insert(library.id, INPUT);
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
                await StoryServices.insert(library.id, INPUT);
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

            const OUTPUT = await StoryServices.insert(library.id, INPUT);
            compareStoryNew(OUTPUT, INPUT);

        })

    })

    describe("StoryServices.remove()", () => {

        it("should fail on invalid ID", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INVALID_ID = -1;

            try {
                await StoryServices.remove(library.id, INVALID_ID);
                expect.fail(`Should have thrown NotFound`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                        (`storyId: Missing Story ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on valid ID", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const stories = await StoryServices.all(library.id);
            const VALID_ID = stories[0].id;

            const story = await StoryServices.remove(library.id, VALID_ID);
            expect(story.id).to.equal(VALID_ID);

            try {
                await StoryServices.remove(library.id, VALID_ID);
                expect.fail("Should have thrown NotFound after remove");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                        (`storyId: Missing Story ${VALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

    })

    describe("StoryServices.series()", () => {

        it("should pass on active Series", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const STORY_NAME: string = SeedData.STORIES_LIBRARY0[0].name
                ? SeedData.STORIES_LIBRARY0[0].name : "can not happen";
            const story = await StoryServices.exact(library.id, STORY_NAME);

            const serieses = await StoryServices.series(library.id, story.id, {
                active: "",
            });
            expect(serieses.length).to.be.greaterThan(0);
            serieses.forEach(series => {
                expect(series.active).to.be.true;
                expect(series.libraryId).to.equal(library.id);
            })

        })

        it("should pass on all Series", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const STORY_NAME: string = SeedData.STORIES_LIBRARY1[1].name
                ? SeedData.STORIES_LIBRARY1[1].name : "can not happen";
            const story = await StoryServices.exact(library.id, STORY_NAME);

            const serieses = await StoryServices.series(library.id, story.id);
            expect(serieses.length).to.be.greaterThan(0);
            serieses.forEach(series => {
                expect(series.libraryId).to.equal(library.id);
            })

        })

        it("should pass on name'd Series", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const STORY_NAME: string = SeedData.STORIES_LIBRARY0[2].name
                ? SeedData.STORIES_LIBRARY0[2].name : "can not happen";
            const story = await StoryServices.exact(library.id, STORY_NAME);
            const NAME_PATTERN = "I"; // Should match "Wilma" and "Flintstone"

            const serieses = await StoryServices.series(library.id, story.id, {
                name: NAME_PATTERN,
            });
            expect(serieses.length).to.be.greaterThan(0);
            serieses.forEach(series => {
                expect(series.libraryId).to.equal(library.id);
                expect(series.name.toLowerCase()).to.include(NAME_PATTERN.toLowerCase());
            })

        })

    })

    describe("StoryServices.update()", () => {

        it("should fail on duplicate data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const stories = await StoryServices.all(library.id);
            const INPUT = {
                name: stories[0].name,
            }

            try {
                await StoryServices.update(library.id, stories[1].id, INPUT);
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
                await StoryServices.update(library.id, INVALID_ID, INPUT);
                expect.fail(`Should have thrown NotFound`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                        (`storyId: Missing Story ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on no changes data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const stories = await StoryServices.all(library.id);
            const INPUT = stories[0];

            const OUTPUT = await StoryServices.update(library.id, INPUT.id, INPUT);
            compareStoryOld(OUTPUT, INPUT);
            const UPDATED = await StoryServices.find(library.id, INPUT.id);
            compareStoryOld(UPDATED, OUTPUT);

        })

        it("should pass on no updates data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const stories = await StoryServices.all(library.id);
            const INPUT = {};
            const VALID_ID = stories[0].id

            const OUTPUT = await StoryServices.update(library.id, VALID_ID, INPUT);
            compareStoryOld(OUTPUT, INPUT);
            const UPDATED = await StoryServices.find(library.id, VALID_ID);
            compareStoryOld(UPDATED, OUTPUT);

        })

        it("should pass on valid updates data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const stories = await StoryServices.all(library.id);
            const INPUT = {
                active: false,
                copyright: "1984",
                name: "New Name",
                type: "Collection",
            };
            const VALID_ID = stories[0].id

            const OUTPUT = await StoryServices.update(library.id, VALID_ID, INPUT);
            compareStoryOld(OUTPUT, INPUT);
            const UPDATED = await StoryServices.find(library.id, VALID_ID);
            compareStoryOld(UPDATED, OUTPUT);

        })

    })

})

// Helper Objects -----------------------------------------------------------

export function compareStoryNew(OUTPUT: Partial<Story>, INPUT: Partial<Story>) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.copyright).to.equal(INPUT.copyright ? INPUT.copyright : null);
    expect(OUTPUT.libraryId).to.equal(INPUT.libraryId );
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
}

export function compareStoryOld(OUTPUT: Partial<Story>, INPUT: Partial<Story>) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.copyright).to.equal(INPUT.copyright ? INPUT.copyright : OUTPUT.copyright);
    expect(OUTPUT.libraryId).to.equal(INPUT.libraryId ? INPUT.libraryId : OUTPUT.libraryId);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
}

