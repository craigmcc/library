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
            // TODO - Library type does not include relation arrays,
            // TODO - although the returned data does have them.
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
            })
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

