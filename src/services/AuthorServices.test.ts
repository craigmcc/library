// AuthorServices.test ------------------------------------------------------

// Functional tests for AuthorServices.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import AuthorServices from "./AuthorServices";
import Author from "../models/Author";
import * as SeedData from "../test/SeedData";
import ServicesUtils from "../test/ServicesUtils";
import {BadRequest, NotFound} from "../util/HttpErrors";

const UTILS = new ServicesUtils();

// Test Specifications ------------------------------------------------------

describe("AuthorServices Functional Tests", () => {

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

    describe("AuthorServices.all()", () => {

        it("should pass on active Authors", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const authors = await AuthorServices.all(library.id, {
                active: "",
            });

            expect(authors.length).to.be.lessThanOrEqual(SeedData.AUTHORS_LIBRARY0.length);
            authors.forEach(author => {
                expect(author.active).to.be.true;
                expect(author.libraryId).to.equal(library.id);
            });

        });

        it("should pass on all Authors", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const authors = await AuthorServices.all(library.id);

            expect(authors.length).to.equal(SeedData.AUTHORS_LIBRARY1.length);
            authors.forEach(author => {
                expect(author.libraryId).to.equal(library.id);
            })

        })

        it("should passed on name'd Authors", async () => {

            const NAME = "tT"; // Should match "Betty Rubble"
            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const authors = await AuthorServices.all(library.id, {
                name: NAME,
            });

            expect(authors.length).to.equal(1);
            authors.forEach(author => {
                expect(author.libraryId).to.equal(library.id);
                expect(author.firstName.toLowerCase().includes(NAME.toLowerCase())
                    || author.lastName.toLowerCase().includes(NAME.toLowerCase()));
            })

        })

    })

    describe("AuthorServices.exact()", () => {

        it("should fail on invalid name", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST)
            const INVALID_FIRST_NAME = "INVALID AUTHOR NAME";
            const INVALID_LAST_NAME = "INVALID LAST NAME";

            try {
                await AuthorServices.exact(library.id, INVALID_FIRST_NAME, INVALID_LAST_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes
                        (`Missing Author '${INVALID_FIRST_NAME} ${INVALID_LAST_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on valid names", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);

            SeedData.AUTHORS_LIBRARY1.forEach(async author => {
                try {
                    const firstName = author.firstName ? author.firstName : "can not happen";
                    const lastName = author.lastName ? author.lastName : "can not happen";
                    await AuthorServices.exact(library.id, firstName, lastName);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            })

        })

    })

    describe("AuthorServices.find()", () => {

        it("should fail on invalid ID", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INVALID_ID = 9999;

            try {
                await AuthorServices.find(library.id, INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                        (`authorId: Missing Author ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on included children", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS = await AuthorServices.all(library.id);

            INPUTS.forEach(async INPUT => {
                const author = await AuthorServices.find(library.id, INPUT.id, {
                    withSeries: "",
                    withStories: "",
                    withVolumes: "",
                });
                expect(author.series).to.exist;
                author.series.forEach(series => {
                    expect(series.libraryId).to.equal(author.id);
                });
                expect(author.stories).to.exist;
                author.stories.forEach(story => {
                    expect(story.libraryId).to.equal(author.id);
                });
                expect(author.volumes).to.exist;
                author.volumes.forEach(volume => {
                    expect(volume.libraryId).to.equal(author.id);
                });
            });

        })

        it("should pass on valid IDs", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS = await AuthorServices.all(library.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await AuthorServices.find(library.id, INPUT.id);
                compareAuthorOld(OUTPUT, INPUT);
            })

        })

    })

    describe("AuthorServices.insert()", () => {

        it("should fail on duplicate data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS = await AuthorServices.all(library.id);
            const INPUT = {
                firstName: INPUTS[0].firstName,
                lastName: INPUTS[0].lastName,
            };

            try {
                await AuthorServices.insert(library.id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include
                        (`name: Name '${INPUT.firstName} ${INPUT.lastName}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should fail on missing data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const INPUT = {};

            try {
                await AuthorServices.insert(library.id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("firstName: Is required");
                    expect(error.message).to.include("lastName: Is required");
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
                firstName: "Valid First Name",
                lastName: "Valid Last Name",
                libraryId: library.id,
            }

            const OUTPUT = await AuthorServices.insert(library.id, INPUT);
            compareAuthorNew(OUTPUT, INPUT);

        })

    })

    describe("AuthorServices.remove()", () => {

        it("should fail on invalid ID", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INVALID_ID = -1;

            try {
                await AuthorServices.remove(library.id, INVALID_ID);
                expect.fail(`Should have thrown NotFound`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                        (`authorId: Missing Author ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on valid ID", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const authors = await AuthorServices.all(library.id);
            const VALID_ID = authors[0].id;

            const author = await AuthorServices.remove(library.id, VALID_ID);
            expect(author.id).to.equal(VALID_ID);

            try {
                await AuthorServices.remove(library.id, VALID_ID);
                expect.fail("Should have thrown NotFound after remove");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                        (`authorId: Missing Author ${VALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

    })

    describe("AuthorServices.series()", () => {

        it("should pass on all Series", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const authors = await AuthorServices.all(library.id);

            authors.forEach(async author => {
                const serieses = await AuthorServices.series(library.id, author.id);
                serieses.forEach(series => {
                    expect(series.libraryId).to.equal(library.id);
                })
            })

        })

    })

    describe("AuthorServices.stories()", () => {

        it("should pass on all Stories", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const authors = await AuthorServices.all(library.id);

            authors.forEach(async author => {
                const stories = await AuthorServices.stories(library.id, author.id);
                stories.forEach(story => {
                    expect(story.libraryId).to.equal(library.id);
                })
            })

        })

    })

    describe("AuthorServices.update()", () => {

        it("should fail on duplicate data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const authors = await AuthorServices.all(library.id);
            const INPUT = {
                firstName: authors[0].firstName,
                lastName: authors[0].lastName,
            }

            try {
                await AuthorServices.update(library.id, authors[1].id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include
                        (`name: Name '${INPUT.firstName} ${INPUT.lastName}' is already in use`);
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
                await AuthorServices.update(library.id, INVALID_ID, INPUT);
                expect.fail(`Should have thrown NotFound`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                        (`authorId: Missing Author ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on no changes data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const authors = await AuthorServices.all(library.id);
            const INPUT = authors[0];

            const OUTPUT = await AuthorServices.update(library.id, INPUT.id, INPUT);
            compareAuthorOld(OUTPUT, INPUT);
            const UPDATED = await AuthorServices.find(library.id, INPUT.id);
            compareAuthorOld(UPDATED, OUTPUT);

        })

        it("should pass on no updates data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const authors = await AuthorServices.all(library.id);
            const INPUT = {};
            const VALID_ID = authors[0].id

            const OUTPUT = await AuthorServices.update(library.id, VALID_ID, INPUT);
            compareAuthorOld(OUTPUT, INPUT);
            const UPDATED = await AuthorServices.find(library.id, VALID_ID);
            compareAuthorOld(UPDATED, OUTPUT);

        })

        it("should pass on valid updates data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const authors = await AuthorServices.all(library.id);
            const INPUT = {
                active: false,
                copyright: "1984",
                name: "New Name",
                type: "Collection",
            };
            const VALID_ID = authors[0].id

            const OUTPUT = await AuthorServices.update(library.id, VALID_ID, INPUT);
            compareAuthorOld(OUTPUT, INPUT);
            const UPDATED = await AuthorServices.find(library.id, VALID_ID);
            compareAuthorOld(UPDATED, OUTPUT);

        })

    })

    describe("AuthorServices.volumes()", () => {

        it("should pass on all Volumes", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const authors = await AuthorServices.all(library.id);

            authors.forEach(async author => {
                const volumes = await AuthorServices.volumes(library.id, author.id);
                volumes.forEach(volume => {
                    expect(volume.libraryId).to.equal(library.id);
                })
            })

        })

    })

})

// Helper Objects -----------------------------------------------------------

export function compareAuthorNew(OUTPUT: Partial<Author>, INPUT: Partial<Author>) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.firstName).to.equal(INPUT.firstName);
    expect(OUTPUT.lastName).to.equal(INPUT.lastName);
    expect(OUTPUT.libraryId).to.equal(INPUT.libraryId );
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
}

export function compareAuthorOld(OUTPUT: Partial<Author>, INPUT: Partial<Author>) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.firstName).to.equal(INPUT.firstName ? INPUT.firstName : OUTPUT.firstName);
    expect(OUTPUT.lastName).to.equal(INPUT.lastName ? INPUT.lastName : OUTPUT.lastName);
    expect(OUTPUT.libraryId).to.equal(INPUT.libraryId ? INPUT.libraryId : OUTPUT.libraryId);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
}

