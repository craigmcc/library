// MockLibraryHandlers --------------------------------------------------------

// Mock service worker handlers for Library models.

// External Modules ----------------------------------------------------------

import {DefaultBodyType, MockedRequest, rest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import {HttpErrorResponse} from "../Helpers";
import * as MockAuthorServices from "../services/MockAuthorServices";
import * as MockLibraryServices from "../services/MockLibraryServices";
import {CREATED, OK} from "../../util/HttpErrors";

// Public Objects ------------------------------------------------------------

const PREFIX = "/api/libraries";

export const libraryHandlers: RestHandler<MockedRequest<DefaultBodyType>>[] = [

    // all -------------------------------------------------------------------
    rest.get(`${PREFIX}`, (req, res, ctx) => {
        const results = MockLibraryServices.all(req.url.searchParams);
        return res(
            ctx.status(OK),
            ctx.json(results),
        );
    }),

    // authors ---------------------------------------------------------------
    rest.get(`${PREFIX}/:libraryId/authors`, (req, res, ctx) => {
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
    rest.get(`${PREFIX}/exact/:name`, (req, res, ctx) => {
        try {
            const {name} = req.params;
            // @ts-ignore
            const result = MockLibraryServices.exact(name, req.url.searchParams);
            return res(
                ctx.status(OK),
                ctx.json(result),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // find ------------------------------------------------------------------
    rest.get(`${PREFIX}/:libraryId`, (req, res, ctx) => {
        try {
            const {libraryId} = req.params;
            // @ts-ignore
            const library = MockLibraryServices.find(Number(libraryId), req.url.searchParams);
            return res(
                ctx.status(OK),
                ctx.json(library),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // insert ----------------------------------------------------------------
    rest.post(`${PREFIX}`, (req, res, ctx) => {
        try {
            // @ts-ignore
            const library = new Library(req.json);
            const inserted = MockLibraryServices.insert(library);
            return res(
                ctx.status(CREATED),
                ctx.json(inserted),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // remove ----------------------------------------------------------------
    rest.delete(`${PREFIX}/:libraryId`, (req, res, ctx) => {
        try {
            const {libraryId} = req.params;
            // @ts-ignore
            const library = MockLibraryServices.remove(Number(libraryId));
            return res(
                ctx.status(OK),
                ctx.json(library),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // TODO - series

    // TODO - stories

    // update ----------------------------------------------------------------
    rest.put(`${PREFIX}/:libraryId`, (req, res, ctx) => {
        try {
            const {libraryId} = req.params;
            // @ts-ignore
            const library = new Library(req.json);
            const updated = MockLibraryServices.insert(library);
            return res(
                ctx.status(OK),
                ctx.json(updated),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // TODO - volumes

];
