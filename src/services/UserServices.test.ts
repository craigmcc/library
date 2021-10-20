// UserServices.test ---------------------------------------------------------

// Functional tests for UserServices.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import UserServices from "./UserServices";
import User from "../models/User";
import * as SeedData from "../util/SeedData";
import {BadRequest, NotFound} from "../util/HttpErrors";
import {loadTestData, lookupUser} from "../util/TestUtils";

// Test Specifications ------------------------------------------------------

describe("UserServices Functional Tests", () => {

    // Test Hooks -----------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await loadTestData({
            withAccessTokens: true,
            withRefreshTokens: true,
            withUsers: true,
        });
    })

    // Test Methods ---------------------------------------------------------

    describe("UserServices.accessTokens()", () => {
        // TODO
    })

    describe("UserServices.all()", () => {

        it("should pass on active Users", async () => {

            const users = await UserServices.all({ active: "" });
            users.forEach(library => {
                expect(library.active).to.be.true;
            });

        })

        it("should pass on all Users", async () => {

            const users = await UserServices.all();
            expect(users.length).to.equal(SeedData.USERS.length);

        })

        it("should pass on included children", async () => {

            const users = await UserServices.all({
                withAccessTokens: "",
                withRefreshTokens: "",
            });

            users.forEach(user => {
                expect(user.accessTokens).to.exist;
                if (user.username === SeedData.USER_USERNAME_SUPERUSER) {
                    expect(user.accessTokens.length).to.equal(SeedData.ACCESS_TOKENS_SUPERUSER.length);
                } else {
                    expect(user.accessTokens.length).to.equal(0);
                }
                user.accessTokens.forEach(accessToken => {
                    expect(accessToken.userId).to.equal(user.id);
                });
                expect(user.refreshTokens).to.exist;
                if (user.username === SeedData.USER_USERNAME_SUPERUSER) {
                    expect(user.refreshTokens.length).to.equal(SeedData.REFRESH_TOKENS_SUPERUSER.length);
                } else {
                    expect(user.refreshTokens.length).to.equal(0);
                }
                user.refreshTokens.forEach(refreshToken => {
                    expect(refreshToken.userId).to.equal(user.id);
                });
            });


        })

        it("should pass on named Users", async () => {

            const PATTERN = "AdM";  // Should match on "admin"

            const users = await UserServices.all({ username: PATTERN });
            expect(users.length).to.be.greaterThan(0);
            expect(users.length).to.be.lessThan(SeedData.USERS.length);
            users.forEach(user => {
                expect(user.username.toLowerCase()).to.include(PATTERN.toLowerCase());
            })

        })

        it("should pass on paginated Users", async () => {

            const LIMIT = 99;
            const OFFSET = 1;
            const INPUTS = await UserServices.all();

            const OUTPUTS = await UserServices.all({
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(OUTPUTS.length).to.be.lessThanOrEqual(LIMIT);
            expect(OUTPUTS.length).to.equal(SeedData.USERS.length - OFFSET);
            OUTPUTS.forEach((OUTPUT, index) => {
                compareUserOld(OUTPUT, INPUTS[index + OFFSET]);
            });

        })

    })

    describe("UserServices.exact()", () => {
        // TODO
    })

    describe("UserServices.find()", () => {
        // TODO
    })

    describe("UserServices.insert()", () => {
        // TODO
    })

    describe("UserServices.refreshTokens()", () => {
        // TODO
    })

    describe("UserServices.remove()", () => {
        // TODO
    })

    describe("UserServices.update()", () => {
        // TODO
    })

})

// Helper Objects ------------------------------------------------------------

export function compareUserNew(OUTPUT: Partial<User>, INPUT: Partial<User>) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.password).to.equal(""); // Redacted
    expect(OUTPUT.scope).to.equal(INPUT.scope);
    expect(OUTPUT.username).to.equal(INPUT.username);
}

export function compareUserOld(OUTPUT: Partial<User>, INPUT: Partial<User>) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.password).to.equal(""); // Redacted
    expect(OUTPUT.scope).to.equal(INPUT.scope ? INPUT.scope : OUTPUT.scope);
}
