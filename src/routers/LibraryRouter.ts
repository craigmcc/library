// LibraryRouter -------------------------------------------------------------

// Express endpoints for Library models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
    requireAdmin,
    requireAny,
    requireRegular,
    requireSuperuser,
} from "../oauth/OAuthMiddleware";
import LibraryServices from "../services/LibraryServices";
import {CREATED} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

export const LibraryRouter = Router({
    strict: true,
});

export default LibraryRouter;

// Model-Specific Routes (no libraryId) --------------------------------------

// GET /exact/:name - Find Library by exact name
LibraryRouter.get("/exact/:name",
    requireAny,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.exact(
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET / - Find all matching Libraries
LibraryRouter.get("/",
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.all(
            req.query
        ));
    });

// POST / - Insert a new Library
LibraryRouter.post("/",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await LibraryServices.insert(
            req.body
        ));
    });

// DELETE /:libraryId - Remove Library by ID
LibraryRouter.delete("/:libraryId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.remove(
            parseInt(req.params.libraryId, 10)
        ));
    });

// GET /:libraryId - Find Library by ID
LibraryRouter.get("/:libraryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.find(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// PUT /:libraryId - Update Library by ID
LibraryRouter.put("/:libraryId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.update(
            parseInt(req.params.libraryId, 10),
            req.body
        ));
    });

// Child Lookup Routes -------------------------------------------------------

// GET /:libraryId/authors - Find matching Authors for this Library
LibraryRouter.get("/:libraryId/authors",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.authors(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/series - Find matching Series for this Library
LibraryRouter.get("/:libraryId/series",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.series(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/stories - Find matching Stories for this Library
LibraryRouter.get("/:libraryId/stories",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.stories(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/users - Find matching Users for this Library
LibraryRouter.get("/:libraryId/users",
    requireAdmin,
    async (req, res) => {
        res.send(await LibraryServices.users(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// POST /:libraryId/users - Insert new User for this Library
LibraryRouter.post("/:libraryId/users",
    requireAdmin,
    async (req, res) => {
        res.send(await LibraryServices.usersInsert(
            parseInt(req.params.libraryId, 10),
            req.body
        ));
    });

// DELETE /:libraryId/users/:userId - Remove existing User for this Library
LibraryRouter.delete("/:libraryId/users/:userId",
    requireAdmin,
    async (req, res) => {
        res.send(await LibraryServices.usersRemove(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.userId, 10),
        ));
    });

// PUT /:libraryId/users - Update existing User for this Library
LibraryRouter.put("/:libraryId/users/:userId",
    requireAdmin,
    async (req, res) => {
        res.send(await LibraryServices.usersUpdate(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.userId, 10),
            req.body
        ));
    });

// GET /:libraryId/users/exact/:username - Find exactly matching User by username
LibraryRouter.get("/:libraryId/users/exact/:username",
    requireAdmin,
    async (req, res) => {
        res.send(await LibraryServices.usersExact(
            parseInt(req.params.libraryId, 10),
            req.params.username,
            req.query
        ));
    });

// GET /:libraryId/volumes - Find matching Volumes for this Library
LibraryRouter.get("/:libraryId/volumes",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.volumes(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });
