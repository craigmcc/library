// handlers ------------------------------------------------------------------

// REST API handlers for Mock Service Worker implementations.

// External Modules ----------------------------------------------------------

import {DefaultBodyType, MockedRequest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import {authorHandlers} from "./handlers/MockAuthorHandlers";
import {libraryHandlers} from "./handlers/MockLibraryHandlers";
import {oauthHandlers} from "./handlers/MockOAuthHandlers";
import {userHandlers} from "./handlers/MockUserHandlers";

// Public Logic --------------------------------------------------------------

const handlers: RestHandler<MockedRequest<DefaultBodyType>>[] = [
    ...authorHandlers,
    ...libraryHandlers,
    ...oauthHandlers,
    ...userHandlers,
];

export default handlers;
