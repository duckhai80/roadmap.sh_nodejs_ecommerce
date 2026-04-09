import { checkoutController } from "@/controllers";
import { checkApiKey } from "@/middlewares";
import express from "express";
import { catchAsync } from "./../../middlewares/catchAsync.middleware";

const checkoutRouter = express.Router();

// Check api key
checkoutRouter.use(catchAsync(checkApiKey));

checkoutRouter.post("/review", catchAsync(checkoutController.checkReview));

export default checkoutRouter;
