// server --------------------------------------------------------------------

// Server configuration for Mock Service Worker implementations.

// External Modules ---------------------------------------------------------

import {setupServer} from "msw/node";

// Internal Modules ---------------------------------------------------------

import handlers from "./handlers";

export const server = setupServer(...handlers);
