// OAuth ---------------------------------------------------------------------

// Basic infrastructure for Axios interactions the an OAuth authentication
// server, rooted at "/oauth".

// External Modules ----------------------------------------------------------

import axios, {AxiosInstance} from "axios";

// Internal Modules ----------------------------------------------------------

const REQUEST_TIMEOUT = 5000; // Request timeout in milliseconds (0 means none)

// Public Objects ------------------------------------------------------------

const OAuth: AxiosInstance = axios.create({
    baseURL: "/oauth",
    timeout: REQUEST_TIMEOUT,
});

export default OAuth;
