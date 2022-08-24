// MockUserHandlers ----------------------------------------------------------

// Mock service worker handlers for User models.

// External Modules ----------------------------------------------------------

import {DefaultBodyType, MockedRequest, rest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import {HttpError} from "../HttpErrors";
import * as MockUserServices from "../services/MockUserServices";

// Public Objects ------------------------------------------------------------

const PREFIX = "/api/users";

export const userHandlers: RestHandler<MockedRequest<DefaultBodyType>>[] = [

    // all -------------------------------------------------------------------
    rest.get(`${PREFIX}`, (req, res, ctx) => {
        const query = userQuery(req.url.searchParams, true);
        const users = MockUserServices.all(query);
        return res(
            ctx.status(200),
            ctx.json(users),
        )
    }),

    // exact -----------------------------------------------------------------
    rest.get(`${PREFIX}/exact/:username`, (req, res, ctx) => {
        const {username} = req.params;
        try {
            const query = userQuery(req.url.searchParams);
            const user = MockUserServices.exact(username as string, query);
            return res(
                ctx.status(200),
                ctx.json(user),
            );
        } catch (error) {
            const httpError = error as HttpError;
            return res(
                ctx.status(httpError.status),
                ctx.json({
                    context: httpError.context,
                    message: httpError.message,
                    status: httpError.status,
                }),
            );
        }
    }),

    // find ------------------------------------------------------------------
    rest.get(`${PREFIX}/:userId`, (req, res, ctx) => {
        const {userId} = req.params;
        try {
            const query = userQuery(req.url.searchParams);
            const user = MockUserServices.find(Number(userId), query);
            return res(
                ctx.status(200),
                ctx.json(user),
            );
        } catch (error) {
            const httpError = error as HttpError;
            return res(
                ctx.status(httpError.status),
                ctx.json({
                    context: httpError.context,
                    message: httpError.message,
                    status: httpError.status,
                }),
            );
        }
    })

];

/**
 * Return a query object based on relevant query parameters from this request.
 * Include parameters are always added, but match parameters are conditional.
 *
 * @param searchParams                  URLSearchParams from this request
 * @param matches                       Add match parameters as well?
 */
export const userQuery = (searchParams: URLSearchParams, matches: boolean = false): any => {
    let result: any = {};
    // Include Parameters
    if (searchParams.get("withAccessTokens")) {
        result.withAccessTokens = "";
    }
    if (searchParams.get("withRefreshTokens")) {
        result.withRefreshTokens = "";
    }
    // Match Parameters
    if (matches) {
        if (searchParams.get("active")) {
            result.active = "";
        }
        if (searchParams.get("username")) {
            result.username = searchParams.get("username");
        }
    }
    return result;
}
