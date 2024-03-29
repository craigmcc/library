// MockAuthorHandlers --------------------------------------------------------

// Mock service worker handlers for Author models.

// External Modules ----------------------------------------------------------

import {rest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import {HttpErrorResponse} from "../Helpers";
import MockAuthorServices from "../services/MockAuthorServices";
import {CREATED, OK} from "../../util/HttpErrors";

// Public Objects ------------------------------------------------------------

const PREFIX = "/api/authors";

export const authorHandlers: RestHandler[] = [

    // all -------------------------------------------------------------------
    rest.get(`${PREFIX}/:libraryId`, (req, res, ctx) => {
        try {
            const {libraryId} = req.params;
            // @ts-ignore
            const authors = MockAuthorServices.all(Number(libraryId), req.url.searchParams);
            return res(
                ctx.status(OK),
                ctx.json(authors),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // exact -----------------------------------------------------------------
    rest.get(`${PREFIX}/:libraryId/exact/:firstName/:lastName`, (req, res, ctx) => {
        try {
            const {libraryId, firstName, lastName} = req.params;
            // @ts-ignore
            const author = MockAuthorServices.exact(Number(libraryId), firstName, lastName, req.url.searchParams);
            return res(
                ctx.status(OK),
                ctx.json(author),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // find ------------------------------------------------------------------
    rest.get(`${PREFIX}/:libraryId/:authorId`, (req, res, ctx) => {
        try {
            const {authorId, libraryId} = req.params;
            // @ts-ignore
            const author = MockAuthorServices.find(Number(libraryId), Number(authorId));
            return res(
                ctx.status(OK),
                ctx.json(author),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // insert ----------------------------------------------------------------
    rest.post(`${PREFIX}/:libraryId`, async (req, res, ctx) => {
        try {
            const {libraryId} = req.params;
            const author = await req.json();
            const inserted = MockAuthorServices.insert(Number(libraryId), author);
            return res(
                ctx.status(CREATED),
                ctx.json(inserted),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // remove ----------------------------------------------------------------
    rest.delete(`${PREFIX}/:libraryId/:authorId`, (req, res, ctx) => {
        try {
            const {authorId, libraryId} = req.params;
            // @ts-ignore
            const author = MockAuthorServices.remove(Number(libraryId), Number(authorId));
            return res(
                ctx.status(OK),
                ctx.json(author),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // update ----------------------------------------------------------------
    rest.put(`${PREFIX}/:libraryId/:authorId`, async (req, res, ctx) => {
        try {
            const {authorId, libraryId} = req.params;
            const author = await req.json();
            const updated = MockAuthorServices.update(Number(libraryId), Number(authorId), author);
            return res(
                ctx.status(OK),
                ctx.json(updated),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

];
