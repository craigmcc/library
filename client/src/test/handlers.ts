// handlers ------------------------------------------------------------------

// REST API handlers for Mock Service Worker implementations.

// External Modules ----------------------------------------------------------

import {DefaultRequestBody, MockedRequest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import authorHandlers from "./MockAuthorHandlers";

// Public Logic --------------------------------------------------------------

const handlers: RestHandler<MockedRequest<DefaultRequestBody>>[] = [
    ...authorHandlers,
];

export default handlers;
