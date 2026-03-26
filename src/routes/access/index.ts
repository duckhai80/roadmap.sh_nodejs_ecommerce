import accessController from "@/controllers/access.controller";
import { checkAuthentication } from "@/middlewares";
import express from "express";
import { catchAsync } from "./../../middlewares/catchAsync.middleware";

const accessRouter = express.Router();

accessRouter.post("/shop/login", catchAsync(accessController.login));
accessRouter.post("/shop/signup", catchAsync(accessController.signup));

accessRouter.use(checkAuthentication);

accessRouter.post("/shop/logout", catchAsync(accessController.logout));

export default accessRouter;
