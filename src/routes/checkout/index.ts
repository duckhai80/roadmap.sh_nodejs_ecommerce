import { checkoutController } from "@/controllers";
import { catchAsync } from "@/middlewares";
import express from "express";

const checkoutRouter = express.Router();

checkoutRouter.post("/review", catchAsync(checkoutController.checkReview));

export default checkoutRouter;
