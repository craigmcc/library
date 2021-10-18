// LibraryServices.test ------------------------------------------------------

// Functional tests for LibraryServices.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import LibraryServices from "./LibraryServices";
import Library from "../models/Library";
import * as SeedData from "../util/SeedData";
import {loadTestData} from "../util/TestUtils";
import {NotFound} from "../util/HttpErrors";

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
                    expect.fail(`Should not have thrown '${(error as Error).message}'`);
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
    expect(OUTPUT.id).to.equal(INPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
    expect(OUTPUT.scope).to.equal(INPUT.scope ? INPUT.scope : OUTPUT.scope);
}
