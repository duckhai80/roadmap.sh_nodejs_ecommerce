import express from "express";
import accessRouter from "./access";
import productRouter from "./product";

const router = express.Router();

router.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello world!",
  });
});

router.use("/v1/api/products", productRouter);
router.use("/v1/api", accessRouter);

export default router;
