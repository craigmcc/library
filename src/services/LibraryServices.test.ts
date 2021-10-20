// LibraryServices.test ------------------------------------------------------

// Functional tests for LibraryServices.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import LibraryServices from "./LibraryServices";
import Library from "../models/Library";
import * as SeedData from "../util/SeedData";
import {loadTestData, lookupLibrary} from "../util/TestUtils";
import {BadRequest, NotFound} from "../util/HttpErrors";

// Test Specifications ------------------------------------------------------

describe("LibraryServices Functional Tests", () => {

    // Test Hooks -----------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await loadTestData({
            withAuthors: true,
            withLibraries: true,
            withSeries: true,
            withStories: true,
            withVolumes: true,
        });
    })

    // Test Methods ---------------------------------------------------------

    describe("LibraryServices.all()", () => {

        it("should pass on active Libraries", async () => {

            const libraries = await LibraryServices.all({ active: "" });
            libraries.forEach(library => {
                expect(library.active).to.be.true;
            });

        })

        it("should pass on all Libraries", async () => {

            const libraries = await LibraryServices.all();
            expect(libraries.length).to.equal(SeedData.LIBRARIES.length);

        })

        it.skip("should pass on included children", async () => {
            // TODO
        })

        it("should pass on named Libraries", async () => {

            const PATTERN = "iBr";  // Should match on "Library"

            const libraries = await LibraryServices.all({ name: PATTERN });
            expect(libraries.length).to.be.greaterThan(0);
            libraries.forEach(library => {
                expect(library.name.toLowerCase()).to.include(PATTERN.toLowerCase());
            })

        })

        it("should pass on paginated Libraries", async () => {

            const LIMIT = 99;
            const OFFSET = 1;
            const INPUTS = await LibraryServices.all();

            const OUTPUTS = await LibraryServices.all({
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(OUTPUTS.length).to.be.lessThanOrEqual(LIMIT);
            expect(OUTPUTS.length).to.equal(SeedData.LIBRARIES.length - 1);
            OUTPUTS.forEach((OUTPUT, index) => {
                compareLibraryOld(OUTPUT, INPUTS[index + OFFSET]);
            });

        })

    })

    describe("LibraryServices.authors()", () => {
        // TODO
    })

    describe("LibraryServices.exact()", () => {

        it("should fail on invalid name", async () => {

            const INVALID_NAME = "INVALID LIBRARY NAME";

            try {
                const result = await LibraryServices.exact(INVALID_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes
                        (`Missing Library '${INVALID_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        })

        it ("should pass on valid names", async () => {

            SeedData.LIBRARIES.forEach(async library => {
                try {
                    const name = library.name ? library.name : "foo";
                    const result = await LibraryServices.exact(name);
                    expect(result.name).equals(name);
                } catch (error) {
                    expect.fail(`Should not have thrown '${(error as Error).message}'`);
                }
            })

        })

    })

    describe("LibraryServices.find()", () => {

        it("should fail on invalid ID", async () => {

            const INVALID_ID = 9999;

            try {
                await LibraryServices.find(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`libraryId: Missing Library ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it.skip("should pass on included children", async () => {
            // TODO
        })

        it("should pass on valid IDs", async () => {

            const INPUTS = await LibraryServices.all();

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await LibraryServices.find(INPUT.id);
                compareLibraryOld(OUTPUT, INPUT);
            })

        })

    })

    describe("LibraryServices.insert()", () => {

        it("should fail on duplicate name", async () => {

            const INPUTS = await LibraryServices.all();
            const INPUT = {
                name: INPUTS[0].name,
                scope: "newscope",
            }

            try {
                await LibraryServices.insert(INPUT);
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

        it("should fail on duplicate scope", async () => {

            const INPUTS = await LibraryServices.all();
            const INPUT = {
                name: "newname",
                scope: INPUTS[0].scope,
            }

            try {
                await LibraryServices.insert(INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include
                    (`scope: Scope '${INPUT.scope}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }

            }

        })

        it("should fail on invalid input data", async () => {

            const INPUT = {};

            try {
                await LibraryServices.insert(INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("Is required");
                } else {
                    expect.fail(`Should not have thrown ${error}'`);
                }
            }

        })

        it("should pass on valid input data", async () => {

            const INPUT = {
                name: "Brand New Name",
                scope: "Brand New Scope",
            }

            const OUTPUT = await LibraryServices.insert(INPUT);
            compareLibraryNew(OUTPUT, INPUT);

        })

    })

    describe("LibraryServices.remove()", () => {

        it("should fail on invalid ID", async () => {

            const INVALID_ID = -1;

            try {
                await LibraryServices.remove(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`libraryId: Missing Library ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on valid ID", async () => {

            const INPUT = await lookupLibrary(SeedData.LIBRARY_NAME_SECOND);

            const OUTPUT = await LibraryServices.remove(INPUT.id);
            expect(OUTPUT.id).to.equal(INPUT.id);

            try {
                await LibraryServices.remove(INPUT.id);
                expect.fail("Should have thrown NotFound after remove");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`libraryId: Missing Library ${INPUT.id}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

    })

    describe("LibraryServices.series()", () => {
        // TODO
    })

    describe("LibraryServices.stories()", () => {
        // TODO
    })

    describe("LibraryServices.update()", () => {

        it("should fail on duplicate name", async () => {

            const ORIGINAL = await lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INPUT = {
                name: SeedData.LIBRARY_NAME_SECOND,
            }

            try {
                await LibraryServices.update(ORIGINAL.id, INPUT);
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

        it("should fail on duplicate scope", async () => {

            const ORIGINAL = await lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INPUT = {
                scope: SeedData.LIBRARY_SCOPE_SECOND,
            }

            try {
                await LibraryServices.update(ORIGINAL.id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include
                    (`scope: Scope '${INPUT.scope}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should fail on invalid ID", async () => {

            const INVALID_ID = -1;
            const ORIGINAL = await lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INPUT = {
                ...ORIGINAL,
            }

            try {
                await LibraryServices.update(INVALID_ID, INPUT);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`libraryId: Missing Library ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on no changes data", async () => {

            const INPUT = await lookupLibrary(SeedData.LIBRARY_NAME_SECOND);

            const OUTPUT = await LibraryServices.update(INPUT.id, INPUT);
            compareLibraryOld(OUTPUT, INPUT);
            const UPDATED = await LibraryServices.find(INPUT.id);
            compareLibraryOld(UPDATED, OUTPUT);

        })

        it("should pass on no updates data", async () => {

            const ORIGINAL = await lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INPUT: Partial<Library> = {};

            const OUTPUT = await LibraryServices.update(ORIGINAL.id, INPUT);
            compareLibraryOld(OUTPUT, INPUT);
            const UPDATED = await LibraryServices.find(ORIGINAL.id);
            compareLibraryOld(UPDATED, OUTPUT);

        })

        it("should pass on valid updates data", async () => {

            const ORIGINAL = await lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INPUT: Partial<Library> = {
                active: false,
                notes: "New note",
            };

            const OUTPUT = await LibraryServices.update(ORIGINAL.id, INPUT);
            compareLibraryOld(OUTPUT, INPUT);
            const UPDATED = await LibraryServices.find(ORIGINAL.id);
            compareLibraryOld(UPDATED, OUTPUT);

        })

    })

    describe("LibraryServices.volumes()", () => {
        // TODO
    })

})

// Helper Objects ------------------------------------------------------------

export function compareLibraryNew(OUTPUT: Partial<Library>, INPUT: Partial<Library>) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
    expect(OUTPUT.scope).to.equal(INPUT.scope);
}

export function compareLibraryOld(OUTPUT: Partial<Library>, INPUT: Partial<Library>) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
    expect(OUTPUT.scope).to.equal(INPUT.scope ? INPUT.scope : OUTPUT.scope);
}
