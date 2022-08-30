// ApiUtil -------------------------------------------------------------------

// Generic utility methods for model specific Redux Toolkit Query implementations.

// External Modules ----------------------------------------------------------

import {BaseQueryFn, fetchBaseQuery} from "@reduxjs/toolkit/query";

// Internal Modules ----------------------------------------------------------

import LocalStorage from "./LocalStorage";
import {LOGIN_DATA_KEY} from "../constants";
import {LoginData} from "../types";

const loginData = new LocalStorage<LoginData>(LOGIN_DATA_KEY);

// Public Objects ------------------------------------------------------------

/**
 * Return the base URL we should pass to RTK API implementations.
 */
export const apiBaseUrl = (): string => {
    return "/api";
}

/**
 * Return the baseQuery implementation we should use.
 *
 * @param baseUrl                       Base URL to be configured
 */
export const apiBaseQuery = (baseUrl: string = apiBaseUrl()): BaseQueryFn => {
    return standardBaseQuery(baseUrl);
}

// Private Objects -----------------------------------------------------------

/**
 * Return a baseQuery implementation using the built-in fetch interface.
 *
 * @param baseUrl                       Base URL to be configured
 */
const standardBaseQuery = (baseUrl: string): BaseQueryFn => {
    return fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers) => {
            const currentData = loginData.value; // TODO - call refresh
            if (currentData.loggedIn) {
                if (currentData.accessToken) {
                    headers.set("Authorization", `Bearer ${currentData.accessToken}`);
                }
                if (currentData.username) {
                    headers.set("x-username", currentData.username);
                }
            }
            return headers;
        }
    });
}
