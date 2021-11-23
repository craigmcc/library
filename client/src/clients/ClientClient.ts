// ClientClient -----------------------------------------------------------------

// Interact with server side logging operations and related facilities.

// Internal Modules ----------------------------------------------------------


import axios, {AxiosInstance} from "axios";

const CLIENT_BASE = "/client";
const REQUEST_TIMEOUT = 30000; // Request timeout in milliseconds (0 means none)

const Client: AxiosInstance = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: REQUEST_TIMEOUT,
});

// Public Objects ------------------------------------------------------------

class ClientClient {

    // Post a log message to the server
    async log(object: any): Promise<void> {
        await Client.post(CLIENT_BASE + "/clientLog", object);
    }

}

export default new ClientClient();
