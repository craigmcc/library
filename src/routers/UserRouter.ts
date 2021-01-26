// UserRouter ----------------------------------------------------------------

// Express endpoints for User operations.

// External Modules ----------------------------------------------------------

import { Request, Response, Router } from "express";

// Internal Modules ----------------------------------------------------------

import { requireSuperuser } from "../oauth/MyMiddleware";
import UserServices from "../services/UserServices";

// Public Objects ------------------------------------------------------------

const UserRouter = Router({
    strict: true
});

UserRouter.use(requireSuperuser); // Finer grained on Library -> User routes

// Model-Specific Routes (no userId) -----------------------------------------

// Find active Users
UserRouter.get("/active",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.active(req.query));
    });

// Find User by exact username
UserRouter.get("/exact/:username",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.exact(req.params.username, req.query));
    });

// Find Users by name match
UserRouter.get("/name/:name",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.name(req.params.name, req.query));
    });

// Find User by exact scope
UserRouter.get("/scope/:scope",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.scope(req.params.scope, req.query));
    });

// Standard CRUD Endpoints ---------------------------------------------------

// Find all Users
UserRouter.get("/",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.all(req.query));
    });

// Insert a new User
UserRouter.post("/",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.insert(req.body));
    });

// Remove User by userId
UserRouter.delete("/:userId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.remove
        (parseInt(req.params.userId)));
    });

// Find User by userId
UserRouter.get("/:userId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.find
        (parseInt(req.params.userId), req.query));
    });

// Update User by userId
UserRouter.put("/:userId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.update
        (parseInt(req.params.userId), req.body));
    });

export default UserRouter;
