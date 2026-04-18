import { cartController } from "@/controllers";
import {
  catchAsync,
  checkAuthentication,
  checkPermission,
} from "@/middlewares";
import express from "express";

const cartRouter = express.Router();

// Check authentication
cartRouter.use(checkPermission("0000"));
cartRouter.use(checkAuthentication);

cartRouter.get("/", catchAsync(cartController.findOne));
cartRouter.post("/", catchAsync(cartController.addToCart));
cartRouter.post("/update-product", catchAsync(cartController.updateProduct));
cartRouter.delete("/delete-product", catchAsync(cartController.deleteProduct));

export default cartRouter;
