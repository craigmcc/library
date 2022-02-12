// MockLibraryHandlers --------------------------------------------------------

// Mock service worker handlers for Library models.

// External Modules ----------------------------------------------------------

import {DefaultRequestBody, MockedRequest, rest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import {HttpError} from "./HttpErrors";
import * as MockLibraryServices from "./MockLibraryServices";

// Public Objects ------------------------------------------------------------

const PREFIX = "/api/libraries";

export const libraryHandlers: RestHandler<MockedRequest<DefaultRequestBody>>[] = [

    // all -------------------------------------------------------------------
    rest.get(`${PREFIX}`, (req, res, ctx) => {
        const query = libraryQuery(req.url.searchParams, true);
        const libraries = MockLibraryServices.all(query);
        return res(
            ctx.status(200),
            ctx.json(libraries),
        )
    }),

    // exact -----------------------------------------------------------------
    rest.get(`${PREFIX}/exact/:name`, (req, res, ctx) => {
        const {name} = req.params;
        try {
            const query = libraryQuery(req.url.searchParams);
            const library = MockLibraryServices.exact(name as string, query);
            return res(
                ctx.status(200),
                ctx.json(library),
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
    rest.get(`${PREFIX}/:libraryId`, (req, res, ctx) => {
        const {libraryId} = req.params;
        try {
            const query = libraryQuery(req.url.searchParams);
            const library = MockLibraryServices.find(Number(libraryId), query);
            return res(
                ctx.status(200),
                ctx.json(library),
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
export const libraryQuery = (searchParams: URLSearchParams, matches: boolean = false): any => {
    let result: any = {};
    // Include Parameters
    if (searchParams.get("withAuthors")) {
        result.withAuthors = "";
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
        if (searchParams.get("active")) {
            result.active = "";
        }
        if (searchParams.get("name")) {
            result.name = searchParams.get("name");
        }
        if (searchParams.get("scope")) {
            result.scope = searchParams.get("scope");
        }
    }
    return result;
}
