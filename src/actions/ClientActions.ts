// actions/ClientActions.ts

/**
 * Action methods for background requests from clients.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import logger from "../util/ClientLogger";

// Public Objects ------------------------------------------------------------

/**
 * Log the specified data to the configured client logger.
 *
 * @param record                        Object to be recorded
 */
export const log = async (record: any): Promise<void> => {
        logger.info(record);
}
