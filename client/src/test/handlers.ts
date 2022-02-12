// handlers ------------------------------------------------------------------

// REST API handlers for Mock Service Worker implementations.

// External Modules ----------------------------------------------------------

import {DefaultRequestBody, MockedRequest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import {authorHandlers} from "./MockAuthorHandlers";
import {libraryHandlers} from "./MockLibraryHandlers";

// Public Logic --------------------------------------------------------------

const handlers: RestHandler<MockedRequest<DefaultRequestBody>>[] = [
    ...authorHandlers,
    ...libraryHandlers,
];

export default handlers;
