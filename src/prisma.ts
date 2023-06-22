// prisma.ts

/**
 * Create a configured instance of the client for Prisma.  This should be
 * used as a singleton throughout the application.
 */

// External Modules ----------------------------------------------------------

import { PrismaClient } from "@prisma/client";

// Public Objects ------------------------------------------------------------

// TODO - support overriding things like datasources/db/url somehow
const prisma = new PrismaClient({
//    log: [ "query", "info", "warn", "error"],
});

export default prisma;
