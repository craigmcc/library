// MockUserHandlers -----------------------------------------------------------

// Mock service worker handlers for User models.

// External Modules ----------------------------------------------------------

import {DefaultBodyType, MockedRequest, rest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import {HttpErrorResponse} from "../Helpers";
import MockUserServices from "../services/MockUserServices";
import {CREATED, OK} from "../../util/HttpErrors";

// Public Objects ------------------------------------------------------------

const PREFIX = "/api/users";

export const userHandlers: RestHandler<MockedRequest<DefaultBodyType>>[] = [

    // all -------------------------------------------------------------------
    rest.get(`${PREFIX}`, (req, res, ctx) => {
        const results = MockUserServices.all(req.url.searchParams);
        return res(
            ctx.status(OK),
            ctx.json(results),
        );
    }),

    // exact -----------------------------------------------------------------
    rest.get(`${PREFIX}/exact/:username`, (req, res, ctx) => {
        try {
            const {username} = req.params;
            // @ts-ignore
            const result = MockUserServices.exact(username, req.url.searchParams);
            return res(
                ctx.status(OK),
                ctx.json(result),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // find ------------------------------------------------------------------
    rest.get(`${PREFIX}/:userId`, (req, res, ctx) => {
        try {
            const {userId} = req.params;
            // @ts-ignore
            const user = MockUserServices.find(Number(userId), req.url.searchParams);
            return res(
                ctx.status(OK),
                ctx.json(user),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // insert ----------------------------------------------------------------
    rest.post(`${PREFIX}`, (req, res, ctx) => {
        try {
            // @ts-ignore
            const user = new User(req.json);
            const inserted = MockUserServices.insert(user);
            return res(
                ctx.status(CREATED),
                ctx.json(inserted),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // remove ----------------------------------------------------------------
    rest.delete(`${PREFIX}/:userId`, (req, res, ctx) => {
        try {
            const {userId} = req.params;
            // @ts-ignore
            const user = MockUserServices.remove(Number(userId));
            return res(
                ctx.status(OK),
                ctx.json(user),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // update ----------------------------------------------------------------
    rest.put(`${PREFIX}/:userId`, (req, res, ctx) => {
        try {
            const {userId} = req.params;
            // @ts-ignore
            const user = new User(req.json);
            const updated = MockUserServices.insert(user);
            return res(
                ctx.status(OK),
                ctx.json(updated),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

];
