// LibraryRouter -------------------------------------------------------------

// Express endpoints for Library operations.

// External Modules ----------------------------------------------------------

import { Request, Response, Router } from "express";

// Internal Modules ----------------------------------------------------------

import {
//    dumpRequestDetails,
    requireAdmin,
    requireAny,
    requireNone,
    requireRegular,
    requireSuperuser
} from "../oauth/MyMiddleware";
import LibraryServices from "../services/LibraryServices";

// Public Objects ------------------------------------------------------------

const LibraryRouter = Router({
    strict: true
});

// Model-Specific Routes (no libraryId) --------------------------------------

// Find active Libraries
LibraryRouter.get("/active",
    requireNone,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.active(req.query));
    });

// Find Library by exact name
LibraryRouter.get("/exact/:name",
    requireAny,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.exact(req.params.name, req.query));
    });

// Find Libraries by name match
LibraryRouter.get("/name/:name",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.name(req.params.name, req.query));
    });

// Find Library by exact scope
LibraryRouter.get("/scope/:scope",
    requireAny,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.scope(req.params.scope, req.query));
    });

// Standard CRUD Endpoints ---------------------------------------------------

// Find all Libraries
LibraryRouter.get("/",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.all(req.query));
    });

// Insert a new Library
LibraryRouter.post("/",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.insert(req.body));
    });

// Remove Library by libraryId
LibraryRouter.delete("/:libraryId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.remove
        (parseInt(req.params.libraryId)));
    });

// Find Library by libraryId
LibraryRouter.get("/:libraryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.find
        (parseInt(req.params.libraryId), req.query));
    });

// Update Library by libraryId
LibraryRouter.put("/:libraryId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.update
        (parseInt(req.params.libraryId), req.body));
    });

export default LibraryRouter;
