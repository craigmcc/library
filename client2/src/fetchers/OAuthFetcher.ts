// fetchers/OAuthFetcher.ts

/**
 * Fetcher implementation for performing API calls to an OAuth server,
 * with JSON body objects.
 */

import Fetcher from "./Fetcher";

/**
 * A Fetcher that utilizes the standard URL prefix for OAuth calls.
 */
class OAuthFetcher extends Fetcher {

    constructor () {
        super("/oauth");
    }

}

const instance = new OAuthFetcher();
export default instance;
