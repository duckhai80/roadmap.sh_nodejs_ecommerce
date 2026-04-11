import { accessController } from "@/controllers";
import {
  catchAsync,
  checkApiKey,
  checkAuthentication,
  checkPermission,
} from "@/middlewares";
import express from "express";

const accessRouter = express.Router();

// Check api key
accessRouter.use(catchAsync(checkApiKey));

// Check permission
accessRouter.use(checkPermission("0000"));

accessRouter.post("/shop/login", catchAsync(accessController.login));
accessRouter.post("/shop/signup", catchAsync(accessController.signup));

accessRouter.use(checkAuthentication);

accessRouter.post("/shop/logout", catchAsync(accessController.logout));
accessRouter.post(
  "/shop/handle-refresh-token",
  catchAsync(accessController.handleRefreshToken),
);

export default accessRouter;
