// ApiRouters ----------------------------------------------------------------

// Consolidate Routers for REST APIs for application objects.

// External Modules ----------------------------------------------------------

import { Router } from "express";

// Internal Modules ----------------------------------------------------------

import LibraryRouter from "./LibraryRouter";
import UserRouter from "./UserRouter";

// Public Objects ------------------------------------------------------------

const ApiRouters = Router({
    strict: true
});

// Static Routers ------------------------------------------------------------

ApiRouters.get("/", (req, res) => {
    res.send("Hello from Library Management Server!");
});

// Model-Specific Routers ----------------------------------------------------

ApiRouters.use("/libraries", LibraryRouter);
ApiRouters.use("/users", UserRouter);

export default ApiRouters;
