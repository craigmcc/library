/**
 * ApiFetcher
 *
 * Fetcher implementation for performing API calls to a REST-based server,
 * with JSON body objects.
 */

import Fetcher from "./Fetcher";

class ApiFetcher extends Fetcher {

    constructor () {
        super("/api");
    }

}

export default new ApiFetcher();
