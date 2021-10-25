// LibraryRouter.test --------------------------------------------------------

// Functional tests for LibraryRouter.

// External Modules ----------------------------------------------------------

// External Modules ----------------------------------------------------------

const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

// Internal Modules ----------------------------------------------------------

import app from "./ExpressApplication";
import Library from "../models/Library";
import RouterUtils, {AUTHORIZATION} from "../test/RouterUtils";
import * as SeedData from "../test/SeedData";
import {CREATED, FORBIDDEN, NOT_FOUND, OK} from "../util/HttpErrors";

const UTILS = new RouterUtils();

// Test Specifications -------------------------------------------------------

describe("LibraryRouter Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await UTILS.loadData({
            withAuthors: true,
            withLibraries: true,
            withSeries: true,
            withStories: true,
            withUsers: true,
            withVolumes: true,
        });
    })

    // Test Methods ----------------------------------------------------------

    describe("LibraryRouter GET /api/libraries/exact/:name", () => {

        const PATH = "/api/libraries/exact/:name";

        it("should fail on invalid name", async () => {

            const INVALID_NAME = "Invalid Name";

            const response = await chai.request(app)
                .get(PATH.replace(":name", INVALID_NAME))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(NOT_FOUND);
            expect(response).to.be.json;
            expect(response.body.message).to.include(`name: Missing Library '${INVALID_NAME}'`);

        })

        it("should fail on unauthenticated request", async () => {

            const response = await chai.request(app)
                .get(PATH.replace(":name", SeedData.LIBRARY_NAME_FIRST));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("No access token presented");

        })

        it("should pass on authenticated admin", async () => {

            const response = await chai.request(app)
                .get(PATH.replace(":name", SeedData.LIBRARY_NAME_FIRST))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.name).to.equal(SeedData.LIBRARY_NAME_FIRST);

        })

        it("should pass on authenticated regular", async () => {

            const response = await chai.request(app)
                .get(PATH.replace(":name", SeedData.LIBRARY_NAME_SECOND))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.name).to.equal(SeedData.LIBRARY_NAME_SECOND);

        })

        it("should pass on authenticated superuser", async () => {

            const response = await chai.request(app)
                .get(PATH.replace(":name", SeedData.LIBRARY_NAME_FIRST))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.name).to.equal(SeedData.LIBRARY_NAME_FIRST);

        })

    })

    describe("LibraryRouter GET /api/libraries", async () => {

        const PATH = "/api/libraries";

        it("should pass on authenticated request", async () => {

            const response = await chai.request(app)
                .get(PATH)
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            const OUTPUTS: Library[] = response.body;
            expect(OUTPUTS.length).to.equal(SeedData.LIBRARIES.length)

        })

        it("should pass on unauthenticated request", async () => {

            const response = await chai.request(app)
                .get(PATH);
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            const OUTPUTS: Library[] = response.body;
            expect(OUTPUTS.length).to.equal(SeedData.LIBRARIES.length)

        })

    })

    describe("LibraryRouter POST /api/libraries", () => {

        const PATH = "/api/libraries";

        it("should fail on authenticated admin", async () => {

            const INPUT: Partial<Library> = {
                name: "Inserted Library",
                scope: "inserted",
            }

            const response = await chai.request(app)
                .post(PATH)
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN))
                .send(INPUT);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on authenticated regular", async () => {

            const INPUT: Partial<Library> = {
                name: "Inserted Library",
                scope: "inserted",
            }

            const response = await chai.request(app)
                .post(PATH)
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR))
                .send(INPUT);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on unauthenticated request", async () => {

            const INPUT: Partial<Library> = {
                name: "Inserted Library",
                scope: "inserted",
            }

            const response = await chai.request(app)
                .post(PATH)
                .send(INPUT);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.equal("No access token presented");

        })

        it("should pass on authenticated superuser", async () => {

            const INPUT: Partial<Library> = {
                name: "Inserted Library",
                scope: "inserted",
            }

            const response = await chai.request(app)
                .post(PATH)
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER))
                .send(INPUT);
            expect(response).to.have.status(CREATED);
            expect(response).to.be.json;
            compareLibraries(response.body, INPUT);

        })

    })

    describe("LibraryRouter DELETE /api/libraries/:libraryId", () => {

        const PATH = "/api/libraries/:libraryId";

        it("should fail on authenticated admin", async () => {

            const INPUT = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);

            const response = await chai.request(app)
                .delete(PATH.replace(":libraryId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on authenticated regular", async () => {

            const INPUT = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);

            const response = await chai.request(app)
                .delete(PATH.replace(":libraryId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on unauthenticated request", async () => {

            const INPUT = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);

            const response = await chai.request(app)
                .delete(PATH.replace(":libraryId", "" + INPUT.id));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.equal("No access token presented");

        })

        it("should pass on authenticated superuser", async () => {

            const INPUT = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);

            // Perform the remove
            const response1 = await chai.request(app)
                .delete(PATH.replace(":libraryId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER));
            expect(response1).to.have.status(OK);
            const OUTPUT: Partial<Library> = response1.body;
            compareLibraries(OUTPUT, INPUT);

            // Verify that the remove was completed
            const response2 = await chai.request(app)
                .get(PATH.replace(":libraryId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER));
            // Libraries are a special case - normally would just expect NOT_FOUND
            if ((response2.status !== FORBIDDEN) && (response2.status !== NOT_FOUND)) {
                expect.fail(`GET /api/libraries/${INPUT.id} returns ${response2.status} instead of 403 or 404`);
            }

        })

    })

    describe("LibraryRouter GET /api/libraries/:libraryId", () => {

        const PATH = "/api/libraries/:libraryId";

        it("should fail on the wrong admin user", async () => {

            const INPUT = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);

            const response = await chai.request(app)
                .get(PATH.replace(":libraryId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on the wrong regular user", async () => {

            const INPUT = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);

            const response = await chai.request(app)
                .get(PATH.replace(":libraryId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should pass on authenticated superuser", async () => { // TODO - SUPERUSER_SCOPE not set in tests ???

            const INPUT = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);

            const response = await chai.request(app)
                .get(PATH.replace(":libraryId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            compareLibraries(response.body, INPUT);

        })

        it("should pass on the right admin user", async () => {

            const INPUT = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);

            const response = await chai.request(app)
                .get(PATH.replace(":libraryId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            compareLibraries(response.body, INPUT);

        })

        it("should pass on the right regular user", async () => {

            const INPUT = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);

            const response = await chai.request(app)
                .get(PATH.replace(":libraryId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            compareLibraries(response.body, INPUT);

        })

    })

    describe("LibraryRouter PUT /api/libraries/:libraryId", () => {

        const PATH = "/api/libraries/:libraryId";

        it("should fail on the right regular user", async () => {

            const ORIGINAL = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INPUT: Partial<Library> = {
                name: "Updated Name",
            }

            const response = await chai.request(app)
                .put(PATH.replace(":libraryId", "" + ORIGINAL.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR))
                .send(INPUT);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on the wrong admin user", async () => {

            const ORIGINAL = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const INPUT: Partial<Library> = {
                name: "Updated Name",
            }

            const response = await chai.request(app)
                .put(PATH.replace(":libraryId", "" + ORIGINAL.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN))
                .send(INPUT);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on the wrong regular user", async () => {

            const ORIGINAL = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_SECOND);
            const INPUT: Partial<Library> = {
                name: "Updated Name",
            }

            const response = await chai.request(app)
                .put(PATH.replace(":libraryId", "" + ORIGINAL.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR))
                .send(INPUT);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should pass on authenticated superuser", async () => { // TODO - SUPERUSER_SCOPE not set in tests ???

            const ORIGINAL = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INPUT: Partial<Library> = {
                name: "Updated Name",
            }

            const response = await chai.request(app)
                .put(PATH.replace(":libraryId", "" + ORIGINAL.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER))
                .send(INPUT);
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            compareLibraries(response.body, INPUT);

        })

        it("should pass on the right admin user", async () => {

            const ORIGINAL = await UTILS.lookupLibrary(SeedData.LIBRARY_NAME_FIRST);
            const INPUT: Partial<Library> = {
                name: "Updated Name",
            }

            const response = await chai.request(app)
                .put(PATH.replace(":libraryId", "" + ORIGINAL.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN))
                .send(INPUT);
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            compareLibraries(response.body, INPUT);

        })

    })

    describe("LibraryRouter GET /api/libraries/:libraryId/authors", () => {
        // TODO
    })

    describe("LibraryRouter GET /api/libraries/:libraryId/series", () => {
        // TODO
    })

    describe("LibraryRouter GET /api/libraries/:libraryId/stories", () => {
        // TODO
    })

    describe("LibraryRouter GET /api/libraries/:libraryId/volumes", () => {
        // TODO
    })

})

// Helper Methods ------------------------------------------------------------

const compareLibraries = (OUTPUT: Partial<Library>, INPUT: Partial<Library>) => {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
    expect(OUTPUT.scope).to.equal(INPUT.scope ? INPUT.scope : OUTPUT.scope);
}
