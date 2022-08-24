// handlers ------------------------------------------------------------------

// REST API handlers for Mock Service Worker implementations.

// External Modules ----------------------------------------------------------

import {DefaultBodyType, MockedRequest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import {authorHandlers} from "./handlers/MockAuthorHandlers";
import {libraryHandlers} from "./handlers/MockLibraryHandlers";
import {userHandlers} from "./handlers/MockUserHandlers";

// Public Logic --------------------------------------------------------------

const handlers: RestHandler<MockedRequest<DefaultBodyType>>[] = [
    ...authorHandlers,
    ...libraryHandlers,
    ...userHandlers,
];

export default handlers;
