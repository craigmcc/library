// UserRouter ----------------------------------------------------------------

// Express endpoints for User models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {requireSuperuser} from "../oauth/OAuthMiddleware";
import UserServices from "../services/UserServices";
import {CREATED} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

export const UserRouter = Router({
    strict: true,
});

// Superuser access required for all routes
UserRouter.use(requireSuperuser);

export default UserRouter;

// Model-Specific Routes (no userId) -----------------------------------------

// GET /exact/:username - Find User by exact username
UserRouter.get("/exact/:username",
    async (req: Request, res: Response) => {
        res.send(await UserServices.exact(
            req.params.username,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET / - Find all matching Users
UserRouter.get("/",
    async (req: Request, res: Response) => {
        res.send(await UserServices.all(
            req.query
        ));
    });

// POST / - Insert a new User
UserRouter.post("/",
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await UserServices.insert(
            req.body
        ));
    });

// DELETE /:userId - Remove User by ID
UserRouter.delete("/:userId",
    async (req: Request, res: Response) => {
        res.send(await UserServices.remove(
            parseInt(req.params.userId, 10)
        ));
    });

// GET /:userId - Find User by ID
UserRouter.get("/:userId",
    async (req: Request, res: Response) => {
        res.send(await UserServices.find(
            parseInt(req.params.userId, 10),
            req.query
        ));
    });

// PUT /:userId - Update User by ID
UserRouter.put("/:userId",
    async (req: Request, res: Response) => {
        res.send(await UserServices.update(
            parseInt(req.params.userId, 10),
            req.body
        ));
    });

// Child Lookup Routes -------------------------------------------------------

// GET /:userId/accessTokens - Find AccessTokens for this User
UserRouter.get("/:userId/accessTokens",
        async (req: Request, res: Response) => {
            res.send(await UserServices.accessTokens(
                parseInt(req.params.userId, 10),
                req.query
            ));
        });

// GET /:userId/refreshTokens - Find RefreshTokens for this User
UserRouter.get("/:userId/refreshTokens",
    async (req: Request, res: Response) => {
        res.send(await UserServices.refreshTokens(
            parseInt(req.params.userId, 10),
            req.query
        ));
    });

