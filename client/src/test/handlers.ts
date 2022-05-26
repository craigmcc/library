// handlers ------------------------------------------------------------------

// REST API handlers for Mock Service Worker implementations.

// External Modules ----------------------------------------------------------

import {DefaultBodyType, MockedRequest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import {authorHandlers} from "./MockAuthorHandlers";
import {libraryHandlers} from "./MockLibraryHandlers";
import {userHandlers} from "./MockUserHandlers";

// Public Logic --------------------------------------------------------------

const handlers: RestHandler<MockedRequest<DefaultBodyType>>[] = [
    ...authorHandlers,
    ...libraryHandlers,
    ...userHandlers,
];

export default handlers;
