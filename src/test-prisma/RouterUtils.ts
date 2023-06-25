// test-prisma/RouterUtils.ts

/**
 * Utilities supporting functional tests of {Model}Router objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Library,
    Prisma,
    User,
} from "@prisma/client";

const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

// Internal Modules ----------------------------------------------------------

import ActionsUtils from "./ActionsUtils";
import * as SeedData from "./SeedData";
import app from "../routers-prisma/ExpressApplication";
import {OK} from "../util/HttpErrors";

// Public Objects -----------------------------------------------------------

// HTTP header for authorization credentials.
export const AUTHORIZATION = "Authorization";

export class RouterUtils extends ActionsUtils {

    /**
     * Fetch the specified Library via an API call, as the specified User
     *
     * @param name                      Library name to look up
     * @param asUsername                Username to perform lookup (superuser)
     */
    public async fetchLibrary(name: string,
                              asUsername = SeedData.USER_USERNAME_SUPERUSER): Promise<Library> {
        const PATH = "/api/libraries/exact/:name";
        const response = await chai.request(app)
            .get(PATH.replace(":name", name))
            .set(AUTHORIZATION, await this.credentials(asUsername));
        expect(response).to.have.status(OK);
        return response.body;
    }

    /**
     * Fetch the specified User via an API call, as the specified User
     *
     * @param username                  User name to look up
     * @param asUsername                Username to perform lookup (superuser)
     */
    public async fetchUser(username: string,
                           asUsername = SeedData.USER_USERNAME_SUPERUSER): Promise<User> {
        const PATH = "/api/users/exact/:username";
        const response = await chai.request(app)
            .get(PATH.replace(":username", username))
            .set(AUTHORIZATION, await this.credentials(asUsername));
        expect(response).to.have.status(OK);
        return response.body;
    }

}

export default RouterUtils;
