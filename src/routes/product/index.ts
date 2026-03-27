import { productController } from "@/controllers";
import { checkAuthentication } from "@/middlewares";
import express from "express";
import { catchAsync } from "./../../middlewares/catchAsync.middleware";

const productRouter = express.Router();

productRouter.use(checkAuthentication);

productRouter.post("/", catchAsync(productController.create));

export default productRouter;
