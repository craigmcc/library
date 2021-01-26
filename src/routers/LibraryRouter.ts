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
import LibraryAuthorServices from "../services/LibraryAuthorServices";
import LibraryServices from "../services/LibraryServices";
import LibraryUserServices from "../services/LibraryUserServices";
import LibraryVolumeServices from "../services/LibraryVolumeServices";

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

// Library -> Author Endpoints -----------------------------------------------

// Find all Authors by libraryId
LibraryRouter.get("/:libraryId/authors",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryAuthorServices.all
            (parseInt(req.params.libraryId), req.query));
    });

// Insert Author by libraryId
LibraryRouter.post("/:libraryId/authors",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryAuthorServices.insert
            (parseInt(req.params.libraryId), req.body));
    });

// Find active Authors by libraryId
LibraryRouter.get("/:libraryId/authors/active",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryAuthorServices.active
            (parseInt(req.params.libraryId), req.query));
    });

// Find Author by libraryId and exact firstName/lastName match
LibraryRouter.get("/:libraryId/authors/exact/:firstName/:lastName",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryAuthorServices.exact(
            parseInt(req.params.libraryId),
            req.params.firstName,
            req.params.lastName,
            req.query));
    });

// Find Author by libraryId and name match
LibraryRouter.get("/:libraryId/authors/name/:name",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryAuthorServices.name
            (parseInt(req.params.libraryId),
            req.params.name,
            req.query));
    });

// Delete Author by libraryId and authorId
LibraryRouter.delete("/:libraryId/authors/:authorId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await LibraryAuthorServices.remove(
            parseInt(req.params.libraryId),
            parseInt(req.params.authorId)));
    });

// Find Author by libraryId and authorId
LibraryRouter.get("/:libraryId/authors/:authorId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryAuthorServices.find(
            parseInt(req.params.libraryId),
            parseInt(req.params.authorId),
            req.query));
    });

// Update Author by libraryId and authorId
LibraryRouter.put("/:libraryId/authors/:authorId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryAuthorServices.update(
            parseInt(req.params.libraryId),
            parseInt(req.params.authorId),
            req.body));
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
            parseInt(req.params.libraryId), parseInt(req.params.userId)));
    });

// Find User by libraryId and userId
LibraryRouter.get("/:libraryId/users/:userId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryUserServices.find(
            parseInt(req.params.libraryId),
            parseInt(req.params.userId),
            req.query));
    });

// Update User by libraryId and userId
LibraryRouter.put("/:libraryId/users/:userId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await LibraryUserServices.update(
            parseInt(req.params.libraryId),
            parseInt(req.params.userId),
            req.body));
    });

// Library -> Volume Endpoints -----------------------------------------------

// Find all Volumes by libraryId
LibraryRouter.get("/:libraryId/volumes",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryVolumeServices.all
            (parseInt(req.params.libraryId), req.query));
    });

// Insert Volume by libraryId
LibraryRouter.post("/:libraryId/volumes",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryVolumeServices.insert
            (parseInt(req.params.libraryId), req.body));
    });

// Find Volume by libraryId and exact name match
LibraryRouter.get("/:libraryId/volumes/exact/:name",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryVolumeServices.exact(
            parseInt(req.params.libraryId),
            req.params.name,
            req.query));
    });

// Find Volume by libraryId and name match
LibraryRouter.get("/:libraryId/volumes/name/:name",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryVolumeServices.name
            (parseInt(req.params.libraryId),
            req.params.name,
            req.query));
    });

// Delete Volume by libraryId and volumeId
LibraryRouter.delete("/:libraryId/volumes/:volumeId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await LibraryVolumeServices.remove(
            parseInt(req.params.libraryId),
            parseInt(req.params.volumeId)));
    });

// Find Volume by libraryId and volumeId
LibraryRouter.get("/:libraryId/volumes/:volumeId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryVolumeServices.find(
            parseInt(req.params.libraryId),
            parseInt(req.params.volumeId),
            req.query));
    });

// Update Volume by libraryId and volumeId
LibraryRouter.put("/:libraryId/volumes/:volumeId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryVolumeServices.update(
            parseInt(req.params.libraryId),
            parseInt(req.params.volumeId),
            req.body));
    });

export default LibraryRouter;
