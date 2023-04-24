// fetchers/ApiFetcher.ts

/**
 * Fetcher implementation for performing API calls to a REST-based server,
 * with JSON body objects.
 */

import Fetcher from "./Fetcher";

/**
 * A Fetcher that utilizes the standard URL prefix for API calls.
 */
class ApiFetcher extends Fetcher {

    constructor () {
        super("/api");
    }

}

const instance = new ApiFetcher();
export default instance;
