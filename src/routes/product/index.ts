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

productRouter.get("", catchAsync(productController.getAllProducts));
productRouter.get("/:product_id", catchAsync(productController.getProduct));
productRouter.get(
  "/search/:keySearch",
  catchAsync(productController.getAllSearchProducts),
);

// Check permission
productRouter.use(checkPermission("0000"));

productRouter.use(checkAuthentication);

productRouter.post("/", catchAsync(productController.create));
productRouter.get(
  "/drafts",
  catchAsync(productController.getAllDraftsByShopId),
);
productRouter.get(
  "/published",
  catchAsync(productController.getAllPublishedByShopId),
);
productRouter.post(
  "/publish/:id",
  catchAsync(productController.publishProductByShopId),
);
productRouter.post(
  "/unpublish/:id",
  catchAsync(productController.unpublishProductByShopId),
);

export default productRouter;
