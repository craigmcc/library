// actions/LibraryActions.test.ts

/**
 *  Functional tests for LibraryActions.
 */

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;
import {
    Author,
    Library,
    Series,
    Story,
    Volume,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "./LibraryActions";
//import prisma from "../prisma";
import * as BaseUtils from "../test-prisma/BaseUtils";
import * as SeedData from "../test-prisma/SeedData";
import {NotFound} from "../util/HttpErrors";
//import * as ToModel from "../util-prisma/ToModel";

// Test Specifications -------------------------------------------------------

describe("LibraryActions Functional Tests", () => {

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

    describe("LibraryActions.all()", () => {

        it("should pass on active Libraries", async () => {
            const libraries = await LibraryActions.all({ active: "" });
            libraries.forEach(library => {
                expect(library.active).to.be.true;
            });
        });

        it("should pass on all Libraries", async () => {
            const libraries = await LibraryActions.all();
            expect(libraries.length).to.equal(SeedData.LIBRARIES.length);
        });

        it("should pass on included children", async () => {
            const libraries = await LibraryActions.all({
                withAuthors: "",
                withSeries: "",
                withStories: "",
                withVolumes: "",
            });
            for (const library of libraries) {
                if (library.name !== SeedData.LIBRARY_NAME_THIRD) {
                    expect(library.authors.length).to.be.greaterThan(0);
                    expect(library.series.length).to.be.greaterThan(0);
                    expect(library.stories.length).to.be.greaterThan(0);
                    expect(library.volumes.length).to.be.greaterThan(0);
                }
            }
        });

        it("should pass on named libraries", async () => {
            const PATTERN = "iBr";
            const libraries = await LibraryActions.all({ name: PATTERN});
            expect(libraries.length).to.be.greaterThan(0);
            libraries.forEach(library => {
                expect(library.name.toLowerCase()).to.include(PATTERN.toLowerCase());
            });
        });

        it("should pass on paginated libraries", async () => {
            const LIMIT = 99;
            const OFFSET = 1;
            const INPUTS = await LibraryActions.all();
            const OUTPUTS = await LibraryActions.all({
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(OUTPUTS.length).to.equal(SeedData.LIBRARIES.length - 1);
            OUTPUTS.forEach((OUTPUT, index) => {
                compareLibraryOld(OUTPUT, INPUTS[index + OFFSET]);
            });
        });

    });

    describe("LibraryActions.exact()", () => {

        it("should fail on invalid name", async () => {
            const INVALID_NAME = "INVALID LIBRARY NAME";
            try {
                await LibraryActions.exact(INVALID_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`Missing Library '${INVALID_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid names", async () => {
            for (const library of SeedData.LIBRARIES) {
                try {
                    const result = await LibraryActions.exact(library.name);
                    expect(result.name).to.equal(library.name);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

    describe("LibraryActions.find()", () => {

        it("should fail on invalid id", async () => {
            const INVALID_ID = 9999;
            try {
                await LibraryActions.find(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`Missing Library ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on included children", async () => {
           const libraries = await LibraryActions.all();
           for (const library of libraries) {
               try {
                   const result = await LibraryActions.find(library.id, {
                       withAuthors:"",
                       withSeries: "",
                       withStories: "",
                       withVolumes: "",
                   });
                   if (result.name !== SeedData.LIBRARY_NAME_THIRD) {
                       expect(result.authors.length).to.be.greaterThan(0);
                       expect(result.series.length).to.be.greaterThan(0);
                       expect(result.stories.length).to.be.greaterThan(0);
                       expect(result.volumes.length).to.be.greaterThan(0);
                   }
               } catch (error) {
                   expect.fail(`Should not have thrown '${error}`);
               }
            }
        });

        it("should pass on valid ids", async () => {
            const libraries = await LibraryActions.all();
            for (const library of libraries) {
                try {
                    const result =
                        await LibraryActions.find(library.id);
                    expect(result.id).to.equal(library.id);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

});

// Private Objects -------------------------------------------------------

export function compareLibraryNew(OUTPUT: Library, INPUT: Library) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
    expect(OUTPUT.scope).to.equal(INPUT.scope);
}

export function compareLibraryOld(OUTPUT: Library, INPUT: Library) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
    expect(OUTPUT.scope).to.equal(INPUT.scope ? INPUT.scope : OUTPUT.scope);
}

