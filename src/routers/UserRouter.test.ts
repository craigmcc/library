// UserRouter.test -----------------------------------------------------------

// Functional tests for UserRouter.

// External Modules ----------------------------------------------------------

import User from "../models/User";

const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

// Internal Modules ----------------------------------------------------------

import app from "./ExpressApplication";
import {CREATED, FORBIDDEN, NOT_FOUND, OK} from "../util/HttpErrors";
import * as SeedData from "../util/SeedData";
import {authorization, AUTHORIZATION, loadTestData, lookupUser} from "../util/TestUtils";

let superuserCredentials: string | null;

// Test Specifications -------------------------------------------------------

describe("UserRouter Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await loadTestData({
            withUsers: true,
        });
        superuserCredentials = await authorizeUser(SeedData.USER_USERNAME_SUPERUSER);
    })

    // Test Methods ----------------------------------------------------------

    describe("UserRouter GET /api/users/exact/:username", () => {

        const PATH = "/api/users/exact/:username";

        it("should fail on authenticated admin", async () => {

            const response = await chai.request(app)
                .get(PATH.replace(":username", SeedData.USER_USERNAME_SUPERUSER))
                .set(AUTHORIZATION, await authorization(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on authenticated regular", async () => {

            const response = await chai.request(app)
                .get(PATH.replace(":username", SeedData.USER_USERNAME_SUPERUSER))
                .set(AUTHORIZATION, await authorization(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should pass on invalid username", async () => {

            const INVALID_USERNAME = "Invalid Username";

            const response = await chai.request(app)
                .get(PATH.replace(":username", INVALID_USERNAME))
                .set(AUTHORIZATION, await authorization(SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(NOT_FOUND);
            expect(response).to.be.json;
            expect(response.body.message).to.include(`username: Missing User '${INVALID_USERNAME}'`);

        })

        it("should fail on unauthenticated request", async () => {

            const response = await chai.request(app)
                .get(PATH.replace(":username", SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.context).to.equal("OAuthMiddleware.requireSuperuser");
            expect(response.body.message).to.equal("No access token presented");

        })

        it("should pass on authenticated superuser", async () => {

            const response = await chai.request(app)
                .get(PATH.replace(":username", SeedData.USER_USERNAME_SUPERUSER))
                .set(AUTHORIZATION, await authorization(SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.username).to.equal(SeedData.USER_USERNAME_SUPERUSER);
            expect(response.body.password).to.equal("");

        })

    })

    describe("UserRouter GET /api/users", () => {

        const PATH = "/api/users";

        it("should fail on authenticated admin", async () => {

            const response = await chai.request(app)
                .get(PATH)
                .set(AUTHORIZATION, await authorization(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on authenticated regular", async () => {

            const response = await chai.request(app)
                .get(PATH)
                .set(AUTHORIZATION, await authorization(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on unauthenticated request", async () => {

            const response = await chai.request(app)
                .get(PATH);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.context).to.equal("OAuthMiddleware.requireSuperuser");
            expect(response.body.message).to.equal("No access token presented");

        })

        it("should pass on authenticated superuser", async () => {

            const response = await chai.request(app)
                .get(PATH)
                .set(AUTHORIZATION, await authorization(SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.length).to.equal(SeedData.USERS.length);

        })

    })

    describe("UserRouter POST /api/users", () => {

        const PATH = "/api/users";

        it("should pass on authenticated superuser", async () => {

            const INPUT: Partial<User> = {
                name: "Inserted User",
                password: "insertedpass",
                scope: "inserted",
                username: "inserteduser",
            }

            const response = await chai.request(app)
                .post(PATH)
                .set(AUTHORIZATION, await authorization(SeedData.USER_USERNAME_SUPERUSER))
                .send(INPUT);
            expect(response).to.have.status(CREATED);
            expect(response).to.be.json;
            const OUTPUT: Partial<User> = response.body;
            compareUsers(OUTPUT, INPUT);

        })

    })

    describe("UserRouter DELETE /api/users/:userId", () => {

        const PATH = "/api/users/:userId";

        it("should pass on authenticated superuser", async () => {

            const INPUT = await fetchUser(SeedData.USER_USERNAME_FIRST_REGULAR);

            // Perform the remove
            const response1 = await chai.request(app)
                .delete(PATH.replace(":userId", "" + INPUT.id))
                .set(AUTHORIZATION, superuserCredentials);
            expect(response1).to.have.status(OK);
            const OUTPUT: Partial<User> = response1.body;
            compareUsers(OUTPUT, INPUT);

            // Verify that the remove was completed
            const response2 = await chai.request(app)
                .get(PATH.replace(":userId", "" + INPUT.id))
                .set(AUTHORIZATION, superuserCredentials);
            expect(response2).to.have.status(NOT_FOUND);

        })

    })

    describe("UserRouter GET /api/users/:userId", () => {

        const PATH = "/api/users/:userId";

        it("should fail on authenticated admin", async () => {

            const user = await lookupUser(SeedData.USER_USERNAME_SUPERUSER);

            const response = await chai.request(app)
                .get(PATH.replace(":userId", "" + user.id))
                .set(AUTHORIZATION, await authorization(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on authenticated regular", async () => {

            const user = await lookupUser(SeedData.USER_USERNAME_SUPERUSER);

            const response = await chai.request(app)
                .get(PATH.replace(":userId", "" + user.id))
                .set(AUTHORIZATION, await authorization(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on unauthenticated request", async () => {

            const user = await lookupUser(SeedData.USER_USERNAME_SUPERUSER);

            const response = await chai.request(app)
                .get(PATH.replace(":userId", "" + user.id));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.context).to.equal("OAuthMiddleware.requireSuperuser");
            expect(response.body.message).to.equal("No access token presented");
            expect(response.body.status).to.equal(403);

        })

        it("should pass on authenticated superuser", async () => {

            const user = await lookupUser(SeedData.USER_USERNAME_SUPERUSER);

            const response = await chai.request(app)
                .get(PATH.replace(":userId", "" + user.id))
                .set(AUTHORIZATION, await authorization(SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.id).to.equal(user.id);
            expect(response.body.password).to.equal("");

        })

    })

})

// Helper Methods ------------------------------------------------------------

const authorizeUser = async (username: string): Promise<string> => {
    return await authorization(username);
}

const compareUsers = (OUTPUT: Partial<User>, INPUT: Partial<User>) => {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.password).to.equal("");   // Redacted
    expect(OUTPUT.scope).to.equal(INPUT.scope ? INPUT.scope : OUTPUT.scope);
    expect(OUTPUT.username).to.equal(INPUT.username ? INPUT.username : OUTPUT.username);

}

const fetchUser = async (username: string): Promise<Partial<User>> => {
    const PATH = "/api/users/exact/:username";
    const response = await chai.request(app)
        .get(PATH.replace(":username", username))
        .set(AUTHORIZATION, superuserCredentials);
    expect(response).to.have.status(OK);
    return response.body;
}

