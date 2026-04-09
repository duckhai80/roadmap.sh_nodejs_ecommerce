import { cartController } from "@/controllers";
import {
  checkApiKey,
  checkAuthentication,
  checkPermission,
} from "@/middlewares";
import express from "express";
import { catchAsync } from "./../../middlewares/catchAsync.middleware";

const cartRouter = express.Router();

// Check api key
cartRouter.use(catchAsync(checkApiKey));

// Check authentication
cartRouter.use(checkPermission("0000"));
cartRouter.use(checkAuthentication);

cartRouter.get("/", catchAsync(cartController.findOne));
cartRouter.post("/", catchAsync(cartController.addToCart));
cartRouter.post("/update-product", catchAsync(cartController.updateProduct));
cartRouter.delete("/delete-product", catchAsync(cartController.deleteProduct));

export default cartRouter;
