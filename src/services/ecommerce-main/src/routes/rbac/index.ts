import { rbacController } from "@/controllers";
import { catchAsync, checkPermission } from "@/middlewares";
import express from "express";

const rbacRouter = express.Router();

/* Router for logged in users */

/* Router for not logged in users */
// Check authentication
rbacRouter.use(checkPermission("0000"));

rbacRouter.post("/roles", catchAsync(rbacController.createRole));
rbacRouter.get("/roles", catchAsync(rbacController.findAllRoles));

rbacRouter.post("/resources", catchAsync(rbacController.createResource));
rbacRouter.get("/resources", catchAsync(rbacController.findAllResources));

export default rbacRouter;
