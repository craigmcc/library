// GoogleBooks ---------------------------------------------------------------

// Basic infrastructure for Axios interactions with the Google Books API.

// External Modules ----------------------------------------------------------

import axios, {AxiosInstance} from "axios";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

const REQUEST_TIMEOUT = 10000; // Request timeout in milliseconds

const GoogleBooksApi: AxiosInstance = axios.create({
    baseURL: "https://www.googleapis.com/books/v1",
    timeout: REQUEST_TIMEOUT,
});

export default GoogleBooksApi;
