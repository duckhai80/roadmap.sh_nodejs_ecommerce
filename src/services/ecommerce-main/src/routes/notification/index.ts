import { notificationController } from "@/controllers";
import {
  catchAsync,
  checkAuthentication,
  checkPermission,
} from "@/middlewares";
import express from "express";

const notificationRouter = express.Router();

/* Router for not logged in users */

/* Router for logged in users */
// Check authentication
notificationRouter.use(checkPermission("0000"));
notificationRouter.use(checkAuthentication);

notificationRouter.get("/", catchAsync(notificationController.findAllByUserId));

export default notificationRouter;
