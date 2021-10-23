// LibraryServices.test ------------------------------------------------------

// Functional tests for LibraryServices.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import LibraryServices from "./LibraryServices";
import Library from "../models/Library";
import Series from "../models/Series";
import Story from "../models/Story";
import Volume from "../models/Volume";
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
                    expect.fail(`Should not have thrown '${error}'`);
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

        it("should fail on duplicate input data", async () => {

            const INPUTS = await LibraryServices.all();
            const INPUT = {
                name: INPUTS[0].name,
                scope: INPUTS[0].scope,
            }

            try {
                await LibraryServices.insert(INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include
                        (`name: Name '${INPUT.name}' is already in use`);
                    expect(error.message).to.include
                        (`scope: Scope '${INPUT.scope}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }

            }

        })

        it("should fail on invalid input data", async () => {

            const INPUTS = await LibraryServices.all();
            const INPUT = {
                name: "Valid Name",
                scope: "invalid scope",
            }

            try {
                await LibraryServices.insert(INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include
                        (`scope: Scope '${INPUT.scope}' must not contain spaces`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }

            }

        })

        it("should fail on missing input data", async () => {

            const INPUT = {};

            try {
                await LibraryServices.insert(INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("name: Is required");
                    expect(error.message).to.include("scope: Is required");
                } else {
                    expect.fail(`Should not have thrown ${error}'`);
                }
            }

        })

        it("should pass on valid input data", async () => {

            const INPUT = {
                active: false,
                name: "Valid Name",
                notes: "Valid notes",
                scope: "validscope",
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

        it("should pass on active Series", async () => {

            const library = await lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const serieses = await LibraryServices.series(library.id, {
                active: "",
            });

            expect(serieses.length).to.be.lessThanOrEqual(SeedData.SERIES_LIBRARY0.length);
            serieses.forEach(series => {
                expect(series.active).to.be.true;
            });

        });

        it("should pass on all Stories", async () => {

            const library = await lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const volumes = await LibraryServices.stories(library.id);

            expect(volumes.length).to.equal(SeedData.STORIES_LIBRARY1.length);

        })

        it("should passed on name'd Stories", async () => {

            const NAME = "tT"; // Should match "Betty Story"
            const library = await lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const stories = await LibraryServices.stories(library.id, {
                name: NAME,
            });

            expect(stories.length).to.equal(1);
            stories.forEach(story => {
                expect(story.name.toLowerCase()).to.include(NAME.toLowerCase());
            })

        })

    })

    describe("LibraryServices.stories()", () => {

        it("should pass on active Stories", async () => {

            const library = await lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const stories = await LibraryServices.stories(library.id, {
                active: "",
            });

            expect(stories.length).to.be.lessThanOrEqual(SeedData.STORIES_LIBRARY0.length);
            stories.forEach(story => {
                expect(story.active).to.be.true;
            });

        });

        it("should pass on all Stories", async () => {

            const library = await lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const volumes = await LibraryServices.stories(library.id);

            expect(volumes.length).to.equal(SeedData.STORIES_LIBRARY1.length);

        })

        it("should passed on name'd Stories", async () => {

            const NAME = "tT"; // Should match "Betty Story"
            const library = await lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const stories = await LibraryServices.stories(library.id, {
                name: NAME,
            });

            expect(stories.length).to.equal(1);
            stories.forEach(story => {
                expect(story.name.toLowerCase()).to.include(NAME.toLowerCase());
            })

        })

    })

    describe("LibraryServices.update()", () => {

        it("should fail on duplicate data", async () => {

            const ORIGINAL = await lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INPUT = {
                name: SeedData.LIBRARY_NAME_SECOND,
                scope: SeedData.LIBRARY_SCOPE_SECOND,
            }

            try {
                await LibraryServices.update(ORIGINAL.id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include
                        (`name: Name '${INPUT.name}' is already in use`);
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
                name: "New Name",
                notes: "New note",
                scope: "newscope",
            };

            const OUTPUT = await LibraryServices.update(ORIGINAL.id, INPUT);
            compareLibraryOld(OUTPUT, INPUT);
            const UPDATED = await LibraryServices.find(ORIGINAL.id);
            compareLibraryOld(UPDATED, OUTPUT);

        })

    })

    describe("LibraryServices.volumes()", () => {

        it("should pass on active Volumes", async () => {

            const library = await lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const volumes = await LibraryServices.volumes(library.id, {
                active: "",
            });

            expect(volumes.length).to.be.lessThanOrEqual(SeedData.VOLUMES_LIBRARY0.length);
            volumes.forEach(volume => {
                expect(volume.active).to.be.true;
            });

        });

        it("should pass on all Volumes", async () => {

            const library = await lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const volumes = await LibraryServices.volumes(library.id);

            expect(volumes.length).to.equal(SeedData.VOLUMES_LIBRARY1.length);

        })

        it("should pass on googleId'd Volumes", async () => {

            const GOOGLE_ID = "222";
            const library = await lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const volumes = await LibraryServices.volumes(library.id, {
                googleId: GOOGLE_ID,
            });

            expect(volumes.length).to.equal(1);
            volumes.forEach(volume => {
                expect(volume.googleId).to.equal(GOOGLE_ID);
            })

        })

        it("should pass on isbn'd Volumes", async () => {

            const ISBN = "fff";
            const library = await lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const volumes = await LibraryServices.volumes(library.id, {
                isbn: ISBN,
            });

            expect(volumes.length).to.equal(1);
            volumes.forEach(volume => {
                expect(volume.isbn).to.equal(ISBN);
            })

        })

        it("should pass on location'd Volumes", async () => {

            const LOCATION = "Computer";
            const library = await lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const volumes = await LibraryServices.volumes(library.id, {
                location: LOCATION,
            });

            expect(volumes.length).to.equal(1);
            volumes.forEach(volume => {
                expect(volume.location).to.equal(LOCATION);
            })

        })

        it("should passed on name'd Volumes", async () => {

            const NAME = "T"; // Should match "Betty Volume"
            const library = await lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const volumes = await LibraryServices.volumes(library.id, {
                name: NAME,
            });

            expect(volumes.length).to.equal(1);
            volumes.forEach(volume => {
                expect(volume.name.toLowerCase()).to.include(NAME.toLowerCase());
            })

        })

        it("should passed on type'd Volumes", async () => {

            const TYPE = "Collection";
            const library = await lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const volumes = await LibraryServices.volumes(library.id, {
                type: TYPE,
            });

            expect(volumes.length).to.equal(1);
            volumes.forEach(volume => {
                expect(volume.type).to.equal(TYPE);
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
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
    expect(OUTPUT.scope).to.equal(INPUT.scope ? INPUT.scope : OUTPUT.scope);
}
