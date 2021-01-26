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
import LibraryUserServices from "../services/LibraryUserServices";

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

// Library -> User Endpoints -------------------------------------------------

// Find all Users by libraryId
LibraryRouter.get("/:libraryId/users",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await LibraryUserServices.all
            (parseInt(req.params.libraryId), req.query));
    });

// Insert User by libraryId
LibraryRouter.post("/:libraryId/users",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await LibraryUserServices.insert
            (parseInt(req.params.libraryId), req.body));
    });

// Find active Users by libraryId
LibraryRouter.get("/:libraryId/users/active",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await LibraryUserServices.active
            (parseInt(req.params.libraryId), req.query));
    });

// Find User by libraryId and exact username match
LibraryRouter.get("/:libraryId/users/exact/:username",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryUserServices.exact
            (parseInt(req.params.libraryId), req.params.username, req.query));
    });

// Find User by libraryId and name match
LibraryRouter.get("/:libraryId/users/name/:name",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryUserServices.name
            (parseInt(req.params.libraryId), req.params.name, req.query));
    });

// Delete User by libraryId and userId
LibraryRouter.delete("/:libraryId/users/:userId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await LibraryUserServices.remove(
            parseInt(req.params.libraryId), parseInt(req.params.userId)
        ));
    });

// Find User by libraryId and userId
LibraryRouter.get("/:libraryId/users/:userId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryUserServices.find(
            parseInt(req.params.libraryId),
            parseInt(req.params.userId),
            req.query)
        );
    });

// Update User by libraryId and userId
LibraryRouter.put("/:libraryId/users/:userId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await LibraryUserServices.update(
            parseInt(req.params.libraryId),
            parseInt(req.params.userId),
            req.body)
        );
    });

export default LibraryRouter;
