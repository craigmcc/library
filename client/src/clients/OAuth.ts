// OAuth ---------------------------------------------------------------------

// Basic infrastructure for Axios interactions the an OAuth authentication
// server, rooted at "/oauth".

// External Modules ----------------------------------------------------------

import axios, {AxiosInstance} from "axios";

// Internal Modules ----------------------------------------------------------

import {LOGIN_DATA_KEY} from "../constants";
import {LoginData} from "../types";
import LocalStorage from "../util/LocalStorage";

const loginData = new LocalStorage<LoginData>(LOGIN_DATA_KEY);

const REQUEST_TIMEOUT = 5000; // Request timeout in milliseconds (0 means none)

// Public Objects ------------------------------------------------------------

const OAuth: AxiosInstance = axios.create({
    baseURL: "/oauth",
    timeout: REQUEST_TIMEOUT,
});

OAuth.interceptors.request.use(function (config) {
    const currentData = loginData.value;
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

export default OAuth;
