// MockAuthorHandlers --------------------------------------------------------

// Mock service worker handlers for Author models.

// External Modules ----------------------------------------------------------

import {DefaultRequestBody, MockedRequest, rest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import {HttpError} from "./HttpErrors";
import * as MockAuthorServices from "./MockAuthorServices";

// Public Logic --------------------------------------------------------------

export const authorHandlers: RestHandler<MockedRequest<DefaultRequestBody>>[] = [

    rest.get("/api/authors/:libraryId/exact/:firstName/:lastName", (req, res, ctx) => {
        const {libraryId, firstName, lastName} = req.params;
        try {
            const author = MockAuthorServices.exact
                (Number(libraryId), firstName as string, lastName as string);
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

export default authorHandlers;
