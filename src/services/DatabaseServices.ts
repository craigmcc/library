// DatabaseServices ----------------------------------------------------------

// Database administrative services.

// External Modules ----------------------------------------------------------

import util from "util";
const exec = util.promisify(require("child_process").exec);
import {Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import RefreshToken from "../models/RefreshToken";
import logger from "../util/ServerLogger";

// Public Objects ------------------------------------------------------------

const COMMAND = "pg_dump";
const DATABASE_URL = process.env.DATABASE_URL ? process.env.DATABASE_URL : "";
const PURGE_BEFORE_MS = 24 * 60 * 60 * 1000; // 24 hours (in milliseconds)

class DatabaseServices {

    /**
     * Cause the contents of our database to be recorded (via pg_dump),
     * which will be returned as a string (which should then be treated
     * as text/plain content).
     */
    public async dump(): Promise<string> {

        const {stdout, stderr} = await exec(`${COMMAND} ${DATABASE_URL}`);
        logger.info({
            context: "DatabaseServices.dump",
            length: stdout.length,
        });
        if (stderr.length > 0) {
            logger.error({
                context: "DatabaseServices.dump",
                msg: "Dump returned stderr output",
                stderr: stderr,
            });
        }
        return stdout;
    }

    /**
     * Purge access_tokens and refresh_tokens that have been expired
     * for long enough to no longer be needed.
     */
    public async purge(): Promise<object> {

        const purgeBefore = new Date((new Date().getTime()) - PURGE_BEFORE_MS);
        const accessTokensPurged = await AccessToken.destroy({
            where: { expires: { [Op.lte]: purgeBefore }}
        });
        const refreshTokensPurged = await RefreshToken.destroy({
            where: { expires: { [Op.lte]: purgeBefore }}
        });

        const results = {
            purgeBefore: purgeBefore.toLocaleString(),
            accessTokensPurged: accessTokensPurged,
            refreshTokensPurged: refreshTokensPurged,
        }
        logger.info({
            context: "DatabaseServices.purge",
            results: results,
        })
        return results;

    }

}

export default new DatabaseServices();
