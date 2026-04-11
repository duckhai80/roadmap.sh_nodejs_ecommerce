import { discountController } from "@/controllers";
import {
  catchAsync,
  checkApiKey,
  checkAuthentication,
  checkPermission,
} from "@/middlewares";
import express from "express";

const discountRouter = express.Router();

// Check api key
discountRouter.use(catchAsync(checkApiKey));

discountRouter.post("/amount", catchAsync(discountController.getAmount));
discountRouter.get(
  "/list-products",
  catchAsync(discountController.findAllProducts),
);

// Check authentication
discountRouter.use(checkPermission("0000"));
discountRouter.use(checkAuthentication);

discountRouter.get("/", catchAsync(discountController.findAllByShopId));
discountRouter.post("/", catchAsync(discountController.create));
discountRouter.delete("/", catchAsync(discountController.delete));

export default discountRouter;
