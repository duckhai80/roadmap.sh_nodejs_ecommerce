import { accessController } from "@/controllers";
import { checkAuthentication } from "@/middlewares";
import express from "express";
import { catchAsync } from "./../../middlewares/catchAsync.middleware";

const accessRouter = express.Router();

accessRouter.post("/shop/login", catchAsync(accessController.login));
accessRouter.post("/shop/signup", catchAsync(accessController.signup));

accessRouter.use(checkAuthentication);

accessRouter.post("/shop/logout", catchAsync(accessController.logout));
accessRouter.post(
  "/shop/handle-refresh-token",
  catchAsync(accessController.handleRefreshToken),
);

export default accessRouter;
