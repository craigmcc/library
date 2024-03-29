// AuthorRouter ---------------------------------------------------------------

// Express endpoints for Author models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
    requireAdmin,
    requireRegular,
    requireSuperuser,
} from "../oauth/OAuthMiddleware";
import AuthorServices from "../services/AuthorServices";
import {CREATED} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

export const AuthorRouter = Router({
    strict: true,
});

export default AuthorRouter;

// Model-Specific Routes (no authorId) ----------------------------------------

// GET /:libraryId/exact/:firstName/:lastName - Find Author by exact name
AuthorRouter.get("/:libraryId/exact/:firstName/:lastName",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.exact(
            parseInt(req.params.libraryId, 10),
            req.params.firstName,
            req.params.lastName,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET /:libraryId - Find all Authors
AuthorRouter.get("/:libraryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.all(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// POST /:libraryId/ - Insert a new Author
AuthorRouter.post("/:libraryId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await AuthorServices.insert(
            parseInt(req.params.libraryId, 10),
            req.body
        ));
    });

// DELETE /:libraryId/:authorId - Remove Author by ID
AuthorRouter.delete("/:libraryId/:authorId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.remove(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
        ));
    });

// GET /:libraryId/:authorId - Find Author by ID
AuthorRouter.get("/:libraryId/:authorId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.find(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            req.query
        ));
    });

// PUT /:libraryId/:authorId - Update Author by ID
AuthorRouter.put("/:libraryId/:authorId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.update(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            req.body
        ));
    });

// Author-Series Relationships ------------------------------------------------

// GET /:libraryId/:authorId/series - Find Series for this Author
AuthorRouter.get("/:libraryId/:authorId/series",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.series(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            req.query
        ));
    });

// DELETE /:libraryId/:authorId/series/:seriesId - Disassociate Author and Series
AuthorRouter.delete("/:libraryId/:authorId/series/:seriesId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.seriesExclude(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            parseInt(req.params.seriesId, 10)
        ));
    });

// POST /:libraryId/:authorId/series/:seriesId - Associate Author and Series
AuthorRouter.post("/:libraryId/:authorId/series/:seriesId",
    requireAdmin,
    async (req: Request, res: Response) => {
        let principal: boolean | undefined = undefined;
        if (req.query && req.query.principal) {
            principal = true;
        }
        res.send(await AuthorServices.seriesInclude(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            parseInt(req.params.seriesId, 10),
            principal
        ));
    });

// Author-Story Relationships ------------------------------------------------

// GET /:libraryId/:authorId/stories - Find Stories for this Author
AuthorRouter.get("/:libraryId/:authorId/stories",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.stories(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            req.query
        ));
    });

// DELETE /:libraryId/:authorId/stories/:storyId - Disassociate Author and Story
AuthorRouter.delete("/:libraryId/:authorId/stories/:storyId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.storiesExclude(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            parseInt(req.params.storyId, 10)
        ));
    });

// POST /:libraryId/:authorId/stories/:storyId - Associate Author and Story
AuthorRouter.post("/:libraryId/:authorId/stories/:storyId",
    requireAdmin,
    async (req: Request, res: Response) => {
        let principal: boolean | undefined = undefined;
        if (req.query && req.query.principal) {
            principal = true;
        }
        res.send(await AuthorServices.storiesInclude(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            parseInt(req.params.storyId, 10),
            principal
        ));
    });

// Author-Volume Relationships ------------------------------------------------

// GET /:libraryId/:authorId/volumes - Find Volumes for this Author
AuthorRouter.get("/:libraryId/:authorId/volumes",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.volumes(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            req.query
        ));
    });

// DELETE /:libraryId/:authorId/volumes/:volumeId - Disassociate Author and Volume
AuthorRouter.delete("/:libraryId/:authorId/volumes/:volumeId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.volumesExclude(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            parseInt(req.params.volumeId, 10)
        ));
    });

// POST /:libraryId/:authorId/volumes/:volumeId - Associate Author and Volume
AuthorRouter.post("/:libraryId/:authorId/volumes/:volumeId",
    requireAdmin,
    async (req: Request, res: Response) => {
        let principal: boolean = false;
        if (req.query && (req.query.principal === "")) {
            principal = true;
        }
        res.send(await AuthorServices.volumesInclude(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            parseInt(req.params.volumeId, 10),
            principal
        ));
    });
