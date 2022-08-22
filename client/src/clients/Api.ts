// Api -----------------------------------------------------------------------

// Basic infrastructure for Axios interactions with the API routes of the
// application server, rooted at "/api".

// External Modules ----------------------------------------------------------

import axios, {AxiosInstance} from "axios";

// Internal Modules ----------------------------------------------------------

import {refresh} from "../util/LoginDataUtils";

// Public Objects ------------------------------------------------------------

const REQUEST_TIMEOUT = 5000; // Request timeout in milliseconds (0 means none)

const Api: AxiosInstance = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: REQUEST_TIMEOUT,
});

Api.interceptors.request.use(async function (config) {
    const currentData = await refresh();
    if (currentData.accessToken) {
        // @ts-ignore
        config.headers["Authorization"] = `Bearer ${currentData.accessToken}`;
    }
    if (currentData.username) {
        // @ts-ignore
        config.headers["X-Username"] = currentData.username;
    }
    return config;
})

export default Api;
