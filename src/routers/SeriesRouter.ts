// SeriesRouter ---------------------------------------------------------------

// Express endpoints for Series models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
    requireAdmin,
    requireRegular,
} from "../oauth/OAuthMiddleware";
import SeriesServices from "../services/SeriesServices";
import {CREATED} from "../util/HttpErrors";
import VolumeServices from "../services/VolumeServices";
import VolumeRouter from "./VolumeRouter";

// Public Objects ------------------------------------------------------------

export const SeriesRouter = Router({
    strict: true,
});

export default SeriesRouter;

// Model-Specific Routes (no seriesId) ----------------------------------------

// GET /:libraryId/exact/:name - Find Series by exact name
SeriesRouter.get("/:libraryId/exact/:name",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.exact(
            parseInt(req.params.libraryId, 10),
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET /:libraryId - Find all Series
SeriesRouter.get("/:libraryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.all(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// POST /:libraryId/ - Insert a new Series
SeriesRouter.post("/:libraryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await SeriesServices.insert(
            parseInt(req.params.libraryId, 10),
            req.body
        ));
    });

// DELETE /:libraryId/:seriesId - Remove Series by ID
SeriesRouter.delete("/:libraryId/:seriesId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.remove(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.seriesId, 10),
        ));
    });

// GET /:libraryId/:seriesId - Find Series by ID
SeriesRouter.get("/:libraryId/:seriesId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.find(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.seriesId, 10),
            req.query
        ));
    });

// PUT /:libraryId/:seriesId - Update Series by ID
SeriesRouter.put("/:libraryId/:seriesId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.update(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.seriesId, 10),
            req.body
        ));
    });

// Series-Author Relationships ------------------------------------------------

/*
// GET /:libraryId/:seriesId/authors - Find Authors for this Series
SeriesRouter.get("/:libraryId/:seriesId/authors",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.authors(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.seriesId, 10),
            req.query
        ));
    });
*/

// Series-Story Relationships ------------------------------------------------

// GET /:libraryId/:seriesId/stories - Find Stories for this Series
SeriesRouter.get("/:libraryId/:seriesId/stories",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.stories(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.seriesId, 10),
            req.query
        ));
    });

// DELETE /:libraryId/:seriesId/stories/:storyId - Disassociate Series and Story
SeriesRouter.delete("/:libraryId/:seriesId/stories/:storyId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.storiesExclude(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.seriesId, 10),
            parseInt(req.params.storyId, 10)
        ));
    });

// POST /:libraryId/:seriesId/stories/:storyId - Associate Series and Story
VolumeRouter.post("/:libraryId/:seriesId/stories/:storyId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.storiesInclude(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.seriesId, 10),
            parseInt(req.params.storyId, 10)
        ));
    });

