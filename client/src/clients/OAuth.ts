// OAuth ---------------------------------------------------------------------

// Basic infrastructure for Axios interactions the an OAuth authentication
// server, rooted at "/oauth".

// External Modules ----------------------------------------------------------

import axios, {AxiosInstance} from "axios";
import {LOGIN_DATA} from "../components/login/LoginContext";

// Internal Modules ----------------------------------------------------------

const REQUEST_TIMEOUT = 5000; // Request timeout in milliseconds (0 means none)

// Public Objects ------------------------------------------------------------

const OAuth: AxiosInstance = axios.create({
    baseURL: "/oauth",
    timeout: REQUEST_TIMEOUT,
});

OAuth.interceptors.request.use(function (config) {
    if (LOGIN_DATA.accessToken) {
        // @ts-ignore
        config.headers["Authorization"] = `Bearer ${LOGIN_DATA.accessToken}`;
    }
    return config;
})

export default OAuth;
