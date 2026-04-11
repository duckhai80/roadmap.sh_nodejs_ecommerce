import { checkoutController } from "@/controllers";
import { catchAsync, checkApiKey } from "@/middlewares";
import express from "express";

const checkoutRouter = express.Router();

// Check api key
checkoutRouter.use(catchAsync(checkApiKey));

checkoutRouter.post("/review", catchAsync(checkoutController.checkReview));

export default checkoutRouter;
