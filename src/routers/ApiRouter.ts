// ApiRouter -----------------------------------------------------------------

// Consolidation of Routers for REST APIs for application Models.

// External Modules ----------------------------------------------------------

import {Router} from "express";

// Internal Modules ----------------------------------------------------------

import AuthorRouter from "./AuthorRouter";
//import ClientRouter from "./ClientRouter";
//import DevModeRouter from "./DevModeRouter";
import LibraryRouter from "./LibraryRouter";
import SeriesRouter from "./SeriesRouter";
import StoryRouter from "./StoryRouter";
import UserRouter from "./UserRouter";
import VolumeRouter from "./VolumeRouter";

// Public Objects ------------------------------------------------------------

export const ApiRouter = Router({
    strict: true,
});

export default ApiRouter;

// Model Specific Routers ----------------------------------------------------

ApiRouter.use("/authors", AuthorRouter);
//ApiRouter.use("/client", ClientRouter);
//ApiRouter.use("/devmode", DevModeRouter);
ApiRouter.use("/libraries", LibraryRouter);
ApiRouter.use("/series", SeriesRouter);
ApiRouter.use("/stories", StoryRouter);
ApiRouter.use("/users", UserRouter);
ApiRouter.use("/volumes", VolumeRouter);
