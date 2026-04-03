import { productController } from "@/controllers";
import {
  checkApiKey,
  checkAuthentication,
  checkPermission,
} from "@/middlewares";
import express from "express";
import { catchAsync } from "./../../middlewares/catchAsync.middleware";

const productRouter = express.Router();

// Check api key
productRouter.use(catchAsync(checkApiKey));

productRouter.post(
  "/",
  checkPermission("0000"),
  checkAuthentication,
  catchAsync(productController.create),
);
productRouter.get(
  "/drafts",
  checkPermission("0000"),
  checkAuthentication,
  catchAsync(productController.findAllDrafts),
);
productRouter.get(
  "/published",
  checkPermission("0000"),
  checkAuthentication,
  catchAsync(productController.findAllPublished),
);
productRouter.post(
  "/publish/:productId",
  checkPermission("0000"),
  checkAuthentication,
  catchAsync(productController.publish),
);
productRouter.post(
  "/unpublish/:productId",
  checkPermission("0000"),
  checkAuthentication,
  catchAsync(productController.unpublish),
);

productRouter.get("", catchAsync(productController.findAll));
productRouter.get("/:productId", catchAsync(productController.findOne));
productRouter.patch(
  "/:productId",
  checkPermission("0000"),
  checkAuthentication,
  catchAsync(productController.update),
);
productRouter.get("/search/:keySearch", catchAsync(productController.search));

export default productRouter;
