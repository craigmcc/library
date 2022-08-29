// MockOAuthHandlers ---------------------------------------------------------

// Mock service worker handlers for OAuth interactions.

// External Modules ----------------------------------------------------------

import {DefaultBodyType, MockedRequest, rest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import {HttpErrorResponse} from "../Helpers";
import {OK} from "../../util/HttpErrors";

// Public Objects -----------------------------------------------------------

const PREFIX = "/oauth";

export const oauthHandlers: RestHandler<MockedRequest<DefaultBodyType>>[] = [

    // token ----------------------------------------------------------------
    rest.post(`${PREFIX}/token`, (req, res, ctx) => {
        try {
            const tokenRequest = req.json();
            const tokenResponse = {
                access_token: "my_access_token",
                expires_in: 60 * 60,    // One hour
                refresh_token: "my_refresh_token",
                scope: "my_scope",
                token_type: "Bearer",
            }
            return res(
                ctx.status(OK),
                ctx.json(tokenResponse),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    })

];
