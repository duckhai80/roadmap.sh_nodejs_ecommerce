import { productController } from "@/controllers";
import {
  catchAsync,
  checkAuthentication,
  checkPermission,
} from "@/middlewares";
import express from "express";

const productRouter = express.Router();

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
