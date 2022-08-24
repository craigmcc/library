// MockAuthorHandlers --------------------------------------------------------

// Mock service worker handlers for Author models.

// External Modules ----------------------------------------------------------

import {DefaultBodyType, MockedRequest, rest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import {HttpError} from "../HttpErrors";
import * as MockAuthorServices from "../services/MockAuthorServices";

// Public Logic --------------------------------------------------------------

const PREFIX = "/api/authors";

export const authorHandlers: RestHandler<MockedRequest<DefaultBodyType>>[] = [

    // all -------------------------------------------------------------------
    rest.get(`${PREFIX}/:libraryId`, (req, res, ctx) => {
        const {libraryId} = req.params;
        const query = authorQuery(req.url.searchParams, true);
        try {
            const authors = MockAuthorServices.all(Number(libraryId), query);
            return res(
                ctx.status(200),
                ctx.json(authors),
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

    // exact -----------------------------------------------------------------
    rest.get(`${PREFIX}/:libraryId/exact/:firstName/:lastName`, (req, res, ctx) => {
        const {libraryId, firstName, lastName} = req.params;
        try {
            const query = authorQuery(req.url.searchParams);
            const author = MockAuthorServices.exact(Number(libraryId),
                firstName as string, lastName as string, query);
            return res(
                ctx.status(200),
                ctx.json(author),
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
    rest.get(`${PREFIX}/:libraryId/:authorId`, (req, res, ctx) => {
        const {libraryId, authorId} = req.params;
        try {
            const query = authorQuery(req.url.searchParams);
            const author = MockAuthorServices.find(Number(libraryId),
                Number(authorId), query);
            return res(
                ctx.status(200),
                ctx.json(author),
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

];

/**
 * Return a query object based on relevant query parameters from this request.
 * Include parameters are always added, but match parameters are conditional.
 *
 * @param searchParams                  URLSearchParams from this request
 * @param matches                       Add match parameters as well?
 */
export const authorQuery = (searchParams: URLSearchParams, matches: boolean = false): any => {
    let result: any = {};
    // Include Parameters
    if (searchParams.get("withLibrary")) {
        result.withLibrary = "";
    }
    if (searchParams.get("withSeries")) {
        result.withSeries = "";
    }
    if (searchParams.get("withStories")) {
        result.withStories = "";
    }
    if (searchParams.get("withVolumes")) {
        result.withVolumes = "";
    }
    // Match Parameters
    if (matches) {
        if ("" === searchParams.get("active")) {
            result.active = "";
        }
        if (searchParams.get("name")) {
            result.name = searchParams.get("name");
        }
    }
    return result;
}
