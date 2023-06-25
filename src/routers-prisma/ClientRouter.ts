// routers-prisma/ClientRouter.ts

/**
 * Router for logging requests from clients.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import * as ClientActions from "../actions/ClientActions";

// Public Objects ------------------------------------------------------------

export const ClientRouter = Router({
    strict: true,
});

ClientRouter.post("/clientLog",
    async (req: Request, res: Response) => {
        await ClientActions.log(req.body);
        res.sendStatus(204);
    })

export default ClientRouter;
