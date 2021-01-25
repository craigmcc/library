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

// Find active Libraries
UserRouter.get("/active",
    async (req: Request, res: Response) => {
        res.send(await UserServices.active(req.query));
    });

// Find User by exact name
UserRouter.get("/exact/:name",
    async (req: Request, res: Response) => {
        res.send(await UserServices.exact(req.params.name, req.query));
    });

// Find Libraries by name match
UserRouter.get("/name/:name",
    async (req: Request, res: Response) => {
        res.send(await UserServices.name(req.params.name, req.query));
    });

// Find User by exact scope
UserRouter.get("/scope/:scope",
    async (req: Request, res: Response) => {
        res.send(await UserServices.scope(req.params.scope, req.query));
    });

// Standard CRUD Endpoints ---------------------------------------------------

// Find all Users
UserRouter.get("/",
    async (req: Request, res: Response) => {
        res.send(await UserServices.all(req.query));
    });

// Insert a new User
UserRouter.post("/",
    async (req: Request, res: Response) => {
        res.send(await UserServices.insert(req.body));
    });

// Remove User by userId
UserRouter.delete("/:userId",
    async (req: Request, res: Response) => {
        res.send(await UserServices.remove
        (parseInt(req.params.userId)));
    });

// Find User by userId
UserRouter.get("/:userId",
    async (req: Request, res: Response) => {
        res.send(await UserServices.find
        (parseInt(req.params.userId), req.query));
    });

// Update User by userId
UserRouter.put("/:userId",
    async (req: Request, res: Response) => {
        res.send(await UserServices.update
        (parseInt(req.params.userId), req.body));
    });

export default UserRouter;
