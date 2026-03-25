import accessController from "@/controllers/access.controller";
import express from "express";
import { catchAsync } from "./../../middlewares/catchAsync.middleware";

const accessRouter = express.Router();

accessRouter.post("/shop/signup", catchAsync(accessController.signUp));

export default accessRouter;
