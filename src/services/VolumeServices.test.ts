// VolumeServices.test ------------------------------------------------------

// Functional tests for VolumeServices.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import VolumeServices from "./VolumeServices";
import Volume from "../models/Volume";
import * as SeedData from "../test/SeedData";
import ServiceUtils from "../test/ServicesUtils";
import {BadRequest, NotFound} from "../util/HttpErrors";

const UTILS = new ServiceUtils();

// Test Specifications ------------------------------------------------------

describe("VolumeServices Functional Tests", () => {

    // Test Hooks -----------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await UTILS.loadData({
            withAuthors: true,
            withLibraries: true,
            withStories: true,
            withVolumes: true,
        });
    })

    // Test Methods ---------------------------------------------------------

    describe("VolumeServices.all()", () => {

        it("should pass on active Volumes", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const volumes = await VolumeServices.all(library.id, {
                active: "",
            });

            expect(volumes.length).to.be.lessThanOrEqual(SeedData.VOLUMES_LIBRARY0.length);
            volumes.forEach(volume => {
                expect(volume.active).to.be.true;
                expect(volume.libraryId).to.equal(library.id);
            });

        });

        it("should pass on all Volumes", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const volumes = await VolumeServices.all(library.id);

            expect(volumes.length).to.equal(SeedData.VOLUMES_LIBRARY1.length);
            volumes.forEach(volume => {
                expect(volume.libraryId).to.equal(library.id);
            })

        })

        it("should pass on googleId'd Volumes", async () => {

            const GOOGLE_ID = "222";
            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const volumes = await VolumeServices.all(library.id, {
                googleId: GOOGLE_ID,
            });

            expect(volumes.length).to.equal(1);
            volumes.forEach(volume => {
                expect(volume.googleId).to.equal(GOOGLE_ID);
                expect(volume.libraryId).to.equal(library.id);
            })

        })

        it("should pass on isbn'd Volumes", async () => {

            const ISBN = "fff";
            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const volumes = await VolumeServices.all(library.id, {
                isbn: ISBN,
            });

            expect(volumes.length).to.equal(1);
            volumes.forEach(volume => {
                expect(volume.isbn).to.equal(ISBN);
                expect(volume.libraryId).to.equal(library.id);
            })

        })

        it("should pass on location'd Volumes", async () => {

            const LOCATION = "Computer";
            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const volumes = await VolumeServices.all(library.id, {
                location: LOCATION,
            });

            expect(volumes.length).to.equal(1);
            volumes.forEach(volume => {
                expect(volume.location).to.equal(LOCATION);
                expect(volume.libraryId).to.equal(library.id);
            })

        })

        it("should passed on name'd Volumes", async () => {

            const NAME = "T"; // Should match "Betty Volume"
            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const volumes = await VolumeServices.all(library.id, {
                name: NAME,
            });

            expect(volumes.length).to.equal(1);
            volumes.forEach(volume => {
                expect(volume.libraryId).to.equal(library.id);
                expect(volume.name.toLowerCase()).to.include(NAME.toLowerCase());
            })

        })

        it("should passed on type'd Volumes", async () => {

            const TYPE = "Collection";
            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const volumes = await VolumeServices.all(library.id, {
                type: TYPE,
            });

            expect(volumes.length).to.equal(1);
            volumes.forEach(volume => {
                expect(volume.libraryId).to.equal(library.id);
                expect(volume.type).to.equal(TYPE);
            })

        })

    })

    describe.skip("VolumeServices.authors()", () => {
        // TODO
    })

    describe("VolumeServices.exact()", () => {

        it("should fail on invalid name", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST)
            const INVALID_NAME = "INVALID VOLUME NAME";

            try {
                await VolumeServices.exact(library.id, INVALID_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes
                    (`Missing Volume '${INVALID_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on valid names", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);

            SeedData.VOLUMES_LIBRARY1.forEach(async volume => {
                try {
                    const name = volume.name ? volume.name : "can not happen";
                    await VolumeServices.exact(library.id, name);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            })

        })

    })

    describe("VolumeServices.find()", () => {

        it("should fail on invalid ID", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INVALID_ID = 9999;

            try {
                await VolumeServices.find(library.id, INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`volumeId: Missing Volume ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on included children", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const volumes = await VolumeServices.all(library.id, {
                withAuthors: "",
                withLibrary: "",
                withStories: "",
            });
            expect(volumes.length).to.be.greaterThan(0);

            volumes.forEach(volume => {
                expect(volume.libraryId).to.equal(library.id);
                expect(volume.library).to.exist;
                expect(volume.library.id).to.equal(library.id);
                // TODO - check volume.authors when available
                expect(volume.stories).to.exist;
                volume.stories.forEach(story => {
                    expect(story.libraryId).to.equal(library.id);
                })
            })

        })

        it("should pass on valid IDs", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS = await VolumeServices.all(library.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await VolumeServices.find(library.id, INPUT.id);
                compareVolumeOld(OUTPUT, INPUT);
            })

        })

    })

    describe("VolumeServices.insert()", () => {

        it("should fail on duplicate data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS = await VolumeServices.all(library.id);
            const INPUT = {
                name: INPUTS[0].name,
            };

            try {
                await VolumeServices.insert(library.id, INPUT);
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

        it("should fail on invalid data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const INPUT = {
                location: "Invalid Location",
                name: "Valid Name",
                scope: "validscope",
                type: "Invalid Type",
            };

            try {
                await VolumeServices.insert(library.id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include(`location: Invalid location '${INPUT.location}'`);
                    expect(error.message).to.include(`type: Invalid type '${INPUT.type}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should fail on missing data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const INPUT = {};

            try {
                await VolumeServices.insert(library.id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("name: Is required");
                    expect(error.message).to.include("type: Is required");
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
                googleId: "123456",
                isbn: "abcdef",
                libraryId: library.id,
                location: "Other",
                name: "Valid Name",
                read: false,
                type: "Collection",
            }

            const OUTPUT = await VolumeServices.insert(library.id, INPUT);
            compareVolumeNew(OUTPUT, INPUT);

        })

    })

    describe("VolumeServices.remove()", () => {

        it("should fail on invalid ID", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INVALID_ID = -1;

            try {
                await VolumeServices.remove(library.id, INVALID_ID);
                expect.fail(`Should have thrown NotFound`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                        (`volumeId: Missing Volume ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on valid ID", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const volumes = await VolumeServices.all(library.id);
            const VALID_ID = volumes[0].id;

            const volume = await VolumeServices.remove(library.id, VALID_ID);
            expect(volume.id).to.equal(VALID_ID);

            try {
                await VolumeServices.remove(library.id, VALID_ID);
                expect.fail("Should have thrown NotFound after remove");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                        (`volumeId: Missing Volume ${VALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

    })

    describe("VolumeServices.stories()", () => {

        it("should pass on active stories", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const VOLUME_NAME: string = SeedData.VOLUMES_LIBRARY0[0].name
                ? SeedData.VOLUMES_LIBRARY0[0].name : "can not happen";
            const volume = await VolumeServices.exact(library.id, VOLUME_NAME);

            const stories = await VolumeServices.stories(library.id, volume.id, {
                active: "",
            });
            expect(stories.length).to.be.greaterThan(0);
            stories.forEach(story => {
                expect(story.active).to.be.true;
                expect(story.libraryId).to.equal(library.id);
            })

        })

        it("should pass on all stories", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const VOLUME_NAME: string = SeedData.VOLUMES_LIBRARY1[1].name
                ? SeedData.VOLUMES_LIBRARY1[1].name : "can not happen";
            const volume = await VolumeServices.exact(library.id, VOLUME_NAME);

            const stories = await VolumeServices.stories(library.id, volume.id);
            expect(stories.length).to.be.greaterThan(0);
            stories.forEach(story => {
                expect(story.libraryId).to.equal(library.id);
            })

        })

        it("should pass on name'd stories", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const VOLUME_NAME: string = SeedData.VOLUMES_LIBRARY0[2].name
                ? SeedData.VOLUMES_LIBRARY0[2].name : "can not happen";
            const volume = await VolumeServices.exact(library.id, VOLUME_NAME);
            const NAME_PATTERN = "I"; // Should match "Wilma" and "Flintstone"

            const stories = await VolumeServices.stories(library.id, volume.id, {
                name: NAME_PATTERN,
            });
            expect(stories.length).to.be.greaterThan(0);
            stories.forEach(story => {
                expect(story.libraryId).to.equal(library.id);
                expect(story.name.toLowerCase()).to.include(NAME_PATTERN.toLowerCase());
            })

        })

    })

    describe("VolumeServices.update()", () => {

        it("should fail on duplicate data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const volumes = await VolumeServices.all(library.id);
            const INPUT = {
                name: volumes[0].name,
            }

            try {
                await VolumeServices.update(library.id, volumes[1].id, INPUT);
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

        it("should fail on invalid data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const volumes = await VolumeServices.all(library.id);
            const INPUT = {
                location: "Invalid Location",
                name: "Valid Name",
                scope: "validscope",
                type: "Invalid Type",
            };

            try {
                await VolumeServices.update(library.id, volumes[0].id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include(`location: Invalid location '${INPUT.location}'`);
                    expect(error.message).to.include(`type: Invalid type '${INPUT.type}'`);
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
                await VolumeServices.update(library.id, INVALID_ID, INPUT);
                expect.fail(`Should have thrown NotFound`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                        (`volumeId: Missing Volume ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on no changes data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const volumes = await VolumeServices.all(library.id);
            const INPUT = volumes[0];

            const OUTPUT = await VolumeServices.update(library.id, INPUT.id, INPUT);
            compareVolumeOld(OUTPUT, INPUT);
            const UPDATED = await VolumeServices.find(library.id, INPUT.id);
            compareVolumeOld(UPDATED, OUTPUT);

        })

        it("should pass on no updates data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const volumes = await VolumeServices.all(library.id);
            const INPUT = {};
            const VALID_ID = volumes[0].id

            const OUTPUT = await VolumeServices.update(library.id, VALID_ID, INPUT);
            compareVolumeOld(OUTPUT, INPUT);
            const UPDATED = await VolumeServices.find(library.id, VALID_ID);
            compareVolumeOld(UPDATED, OUTPUT);

        })

        it("should pass on valid updates data", async () => {

            const library = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const volumes = await VolumeServices.all(library.id);
            const INPUT = {
                active: false,
                copyright: "2020",
                googleId: "New Google ID",
                isbn: "New ISBN",
                location: "Box",
                name: "New Name",
                notes: "New Notes",
                read: true,
                type: "Collection",
            };
            const VALID_ID = volumes[0].id

            const OUTPUT = await VolumeServices.update(library.id, VALID_ID, INPUT);
            compareVolumeOld(OUTPUT, INPUT);
            const UPDATED = await VolumeServices.find(library.id, VALID_ID);
            compareVolumeOld(UPDATED, OUTPUT);

        })

    })

})

// Helper Objects -----------------------------------------------------------

export function compareVolumeNew(OUTPUT: Partial<Volume>, INPUT: Partial<Volume>) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.copyright).to.equal(INPUT.copyright ? INPUT.copyright : null);
    expect(OUTPUT.googleId).to.equal(INPUT.googleId ? INPUT.googleId : null);
    expect(OUTPUT.isbn).to.equal(INPUT.isbn ? INPUT.isbn : null);
    expect(OUTPUT.libraryId).to.equal(INPUT.libraryId );
    expect(OUTPUT.location).to.equal(INPUT.location ? INPUT.location : null);
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
    expect(OUTPUT.read).to.equal(INPUT.read !== undefined ? INPUT.read : false);
    expect(OUTPUT.type).to.equal(INPUT.type);
}

export function compareVolumeOld(OUTPUT: Partial<Volume>, INPUT: Partial<Volume>) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.copyright).to.equal(INPUT.copyright ? INPUT.copyright : OUTPUT.copyright);
    expect(OUTPUT.googleId).to.equal(INPUT.googleId ? INPUT.googleId : OUTPUT.googleId);
    expect(OUTPUT.isbn).to.equal(INPUT.isbn ? INPUT.isbn : OUTPUT.isbn);
    expect(OUTPUT.libraryId).to.equal(INPUT.libraryId ? INPUT.libraryId : OUTPUT.libraryId);
    expect(OUTPUT.location).to.equal(INPUT.location ? INPUT.location : OUTPUT.location);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
    expect(OUTPUT.read).to.equal(INPUT.read !== undefined ? INPUT.read : OUTPUT.read);
    expect(OUTPUT.type).to.equal(INPUT.type ? INPUT.type : OUTPUT.type);
}
