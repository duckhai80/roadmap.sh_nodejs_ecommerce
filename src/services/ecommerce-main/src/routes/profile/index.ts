import { grantAccess } from "./../../middlewares/rbac.middleware";
import { profileController } from "@/controllers";
import {
  catchAsync,
  checkAuthentication,
  checkPermission,
} from "@/middlewares";
import express from "express";

const profileRouter = express.Router();

/* Router for not logged in users */

/* Router for logged in users */
// Check authentication
// profileRouter.use(checkPermission("0000"));
// profileRouter.use(checkAuthentication);

profileRouter.get(
  "/view-any",
  grantAccess("readAny", "profile"),
  catchAsync(profileController.findAll),
);
profileRouter.get(
  "/view-own",
  grantAccess("readOwn", "profile"),
  catchAsync(profileController.findOne),
);

export default profileRouter;
