import { checkApiKey, checkPermission } from "@/middlewares";
import express from "express";
import { catchAsync } from "./../middlewares/catchAsync.middleware";
import accessRouter from "./access";
import productRouter from "./product";

const router = express.Router();

// Check api key
router.use(catchAsync(checkApiKey));

// Check permission
router.use(checkPermission("0000"));

router.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello world!",
  });
});

router.use("/v1/api", accessRouter);
router.use("/v1/api/products", productRouter);

export default router;
