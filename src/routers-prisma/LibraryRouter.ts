// routers-prisma/LibraryRouter.ts

/**
 * Express routes for Library models.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "../actions/LibraryActions";
import {
    requireAdmin,
    requireAny,
    requireRegular,
    requireSuperuser,
} from "../oauth-prisma/OAuthMiddleware";
import {CREATED} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

export const LibraryRouter = Router({
    strict: true,
});

export default LibraryRouter;

// Model-Specific Routes (no libraryId) --------------------------------------

/**
 * GET - Find and return a Library by exact name.
 */
LibraryRouter.get("/exact/:name",
    requireAny,
    async (req: Request, res: Response) => {
        res.send(await LibraryActions.exact(
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

/**
 * GET - Find and return all matching Libraries.
 */
LibraryRouter.get("/",
    async (req: Request, res: Response) => {
        res.send(await LibraryActions.all(
            req.query
        ));
    });

/**
 * POST - Insert and return a new Library.
 */
LibraryRouter.post("/",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await LibraryActions.insert(
            req.body
        ));
    });

/**
 * DELETE - Remove and return a Library by ID.
 */
LibraryRouter.delete("/:libraryId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await LibraryActions.remove(
            parseInt(req.params.libraryId, 10)
        ));
    });

/**
 * GET - Find and return a Library by ID.
 */
LibraryRouter.get("/:libraryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryActions.find(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

/**
 * PUT - Update and return a Library by ID.
 */
LibraryRouter.put("/:libraryId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await LibraryActions.update(
            parseInt(req.params.libraryId, 10),
            req.body
        ));
    });

// Child Lookup Routes -------------------------------------------------------

/**
 * GET - Find and return matching Authors for a Library by ID.
 */
LibraryRouter.get("/:libraryId/authors",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryActions.authors(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

/**
 * GET - Find and return matching Series for a Library by ID.
 */
LibraryRouter.get("/:libraryId/series",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryActions.series(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

/**
 * GET - Find and return matching Stories for a Library by ID.
 */
LibraryRouter.get("/:libraryId/stories",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryActions.stories(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

/**
 * GET - Return all users whose scope includes a scope value that starts
 * with the scope prefix for this Library.
 */
LibraryRouter.get("/:libraryId/users",
    requireAdmin,
    async (req, res) => {
        res.send(await LibraryActions.users(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

/**
 * POST - Insert and return a new User for this Library.
 */
LibraryRouter.post("/:libraryId/users",
    requireAdmin,
    async (req, res) => {
        res.send(await LibraryActions.usersInsert(
            parseInt(req.params.libraryId, 10),
            req.body
        ));
    });

/**
 * DELETE - Remove and return an existing User for this Library.
 */
LibraryRouter.delete("/:libraryId/users/:userId",
    requireAdmin,
    async (req, res) => {
        res.send(await LibraryActions.usersRemove(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.userId, 10),
        ));
    });

/**
 * PUT - Update and return an existing User for this Library.
 */
LibraryRouter.put("/:libraryId/users/:userId",
    requireAdmin,
    async (req, res) => {
        res.send(await LibraryActions.usersUpdate(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.userId, 10),
            req.body
        ));
    });

/**
 * GET - Find and return the matching User by username for this Library.
 */
LibraryRouter.get("/:libraryId/users/exact/:username",
    requireAdmin,
    async (req, res) => {
        res.send(await LibraryActions.usersExact(
            parseInt(req.params.libraryId, 10),
            req.params.username,
            req.query
        ));
    });

/**
 * GET - Find and return matching Stories for a Library by ID.
 */
LibraryRouter.get("/:libraryId/volumes",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryActions.volumes(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });
