// util/ClientLogger

/**
 * Configure and return a logger for this browser-based application.
 *
 * The goal here is to allow develoeprs to use the same "logger.<level>()"
 * semantics on the client side that they get to use on the server side,
 * with additional capabilities to dynamically change the client side leve
 * at which logging messages should be forwarded to the server.
 *
 * There is also special treatment when a logger is used (indirectly)
 * in unit tests.
 *
 * @packageDocumentation
 */


// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {Level} from "../types";

// Private Objects -----------------------------------------------------------

const TEST_ENV = "test" === process.env.NODE_ENV;

/**
 * Map log level names to log level values.
 */
const LOG_LEVEL_MAP = new Map<string, number>();
LOG_LEVEL_MAP.set(Level.DEBUG, 20);
LOG_LEVEL_MAP.set(Level.ERROR, 50);
LOG_LEVEL_MAP.set(Level.FATAL, 60);
LOG_LEVEL_MAP.set(Level.INFO, 30);
LOG_LEVEL_MAP.set(Level.TRACE, 10);
LOG_LEVEL_MAP.set(Level.WARN, 40);

// Public Objects ------------------------------------------------------------

/**
 * Class defining a client side logger.
 */
class logger {

    constructor() {
        this.currentLevel = 30; // Default log level
    }

    // Public Methods --------------------------------------------------------

    public debug(object: any) { this.write(object, 20); }
    public error(object: any) { this.write(object, 50); }
    public fatal(object: any) { this.write(object, 60); }
    public info(object: any) { this.write(object, 30); }
    public trace(object: any) { this.write(object, 10); }
    public warn(object: any) { this.write(object, 40); }

    /**
     * Dynamically set a new log level.
     * @param newName
     */
    public setLevel(newName: string) {
        let newLevel: number | undefined = LOG_LEVEL_MAP.get(newName);
        if (newLevel) {
            this.currentLevel = newLevel;
        } else {
            this.currentLevel = 30;
        }
    }

    // Private Methods -------------------------------------------------------

    /**
     * Write the specified object if we are at the specified log level
     * or greater.
     *
     * @param object    Object to be logged
     * @param level     Minimum numeric log level at which to log this object
     * @private
     */
    private async write(object: any, level: number) {
        if (level >= this.currentLevel) {
            const output = {
                level: level,
                ...object,
            }
            if (!TEST_ENV) {
                try {
                    await fetch("/api/client/clientLog", {
                        body: JSON.stringify(object),
                        headers: {
                            "Content-Type": "application/json",
                        },
                        method: "POST"
                    })
                } catch (error) {
                    console.error(`Error '${(error as Error).message}' logging client message`, object);
                }
            } else {
                console.log(output);
            }
        }

    }

    // Private Properties ----------------------------------------------------

    /**
     * The current log level, after being translated to a numeric value.
     * @private
     */
    private currentLevel: number;

}

const instance = new logger();
export default instance;