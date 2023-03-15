/**
 * Fetcher
 *
 * Abstract base class for implementations that provide convenient HTTP methods
 * to communicate with a server, and rejecting with an appropriate HttpError on
 * any failure (i.e. status not in the range 200-299).
 */

import {
    BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, NOT_UNIQUE,
    BadRequest, Forbidden, NotFound, NotUnique, ServerError, ServiceUnavailable, Unauthorized,
} from "../util/HttpErrors";
import {refresh} from "../util/LoginDataUtils";

const REQUEST_TIMEOUT = 5000;       // Request timeout in milliseconds

abstract class Fetcher {

    constructor (baseURL: string) {
        this.baseURL = baseURL;
    }

    protected baseURL: string;

    // Public Methods --------------------------------------------------------

    /**
     * Perform an HTTP DELETE operation to the specified URL, and return the
     * data returned by the server.
     *
     * @param url URL (relative to the baseURL specified to the constructor)
     * @return data Data from the server, after conversion from JSON
     * @throws HttpError if a non-OK HTTP status was returned
     */
    public async delete(url: string): Promise<any> {
        return this.execute(this.absoluteURL(url), "DELETE");
    }

    /**
     * Perform an HTTP GET operation to the specified URL, and return the
     * data returned by the server.
     *
     * @param url URL (relative to the baseURL specified to the constructor)
     * @return data Data from the server, after conversion from JSON
     * @throws HttpError if a non-OK HTTP status was returned
     */
    public async get(url: string): Promise<any> {
        return this.execute(this.absoluteURL(url), "GET");
    }

    /**
     * Perform an HTTP POST operation to the specified URL, and return the
     * data returned by the server.
     *
     * @param url URL (relative to the baseURL specified to the constructor)
     * @param body Body content to be JSONified and sent with the request (if any)
     * @return data Data from the server, after conversion from JSON
     * @throws HttpError if a non-OK HTTP status was returned
     */
    public async post(url: string, body?: any): Promise<any> {
        return this.execute(this.absoluteURL(url), "POST", body);
    }

    /**
     * Perform an HTTP PUT operation to the specified URL, and return the
     * data returned by the server.
     *
     * @param url URL (relative to the baseURL specified to the constructor)
     * @param body Body content to be JSONified and sent with the request
     * @return data Data from the server, after conversion from JSON
     * @throws HttpError if a non-OK HTTP status was returned
     */
    public async put(url: string, body: any): Promise<any> {
        return this.execute(this.absoluteURL(url), "PUT", body);
    }

    // Private Methods -------------------------------------------------------

    /**
     * Calculate and return the absolute URL for this request.
     *
     * @param url URL (relative to the baseURL specified to the constructor)
     * @returns Specified url prefixed by the baseURL
     */
    private absoluteURL(url: string): string {
        return `${this.baseURL}${url}`;
    }

    /**
     * Perform the HTTP request specified by these parameters,
     * and return the result data from the HTTP response.
     *
     * @param absoluteURL Absolute URL for this request
     * @param method HTTP method to be performed
     * @param body Body content to include (for POST and PUT calls)
     * @return response data as an object (if any)
     * @throws HttpError if a request status outside 200-299 is returned
     */
    private async execute(absoluteURL: string, method: string, body?: any): Promise<any> {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
        let response: Response = new Response();
        try {
            response = await fetch(absoluteURL, {
                body: body ? JSON.stringify(body) : undefined,
                headers: await this.headers(),
                method: method,
                signal: controller.signal,
            });
        } catch (error) {
            throw new ServiceUnavailable("Request timed out")
        } finally {
            clearTimeout(id);
        }
        if (!response.ok) {
            switch (response.status) {
                case BAD_REQUEST: throw new BadRequest(response.statusText);
                case UNAUTHORIZED: throw new Unauthorized(response.statusText);
                case FORBIDDEN: throw new Forbidden(response.statusText);
                case NOT_FOUND: throw new NotFound(response.statusText);
                case NOT_UNIQUE: throw new NotUnique(response.statusText);
                default: throw new ServerError(response.statusText);
            }
        }
        const data = await response.json();
        return data;

    }

    /**
     * Calculate and return a Headers object for this request.
     */
    private async headers(): Promise<Headers> {
        const currentData = await refresh();
        const headers: Headers = new Headers({
            "Content-Type": "application/json",
        });
        if (currentData.accessToken) {
            headers.append("Authorization", `Bearer ${currentData.accessToken}`);
        }
        if (currentData.username) {
            headers.append("X-Username", currentData.username);
        }
        return headers;
    }

}

export default Fetcher;
