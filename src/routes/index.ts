import express from "express";
import accessRouter from "./access";
import cartRouter from "./cart";
import checkoutRouter from "./checkout";
import discountRouter from "./discount";
import inventoryRouter from "./inventory";
import productRouter from "./product";

const router = express.Router();

router.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello world!",
  });
});

router.use("/v1/api/products", productRouter);
router.use("/v1/api/discounts", discountRouter);
router.use("/v1/api/carts", cartRouter);
router.use("/v1/api/checkouts", checkoutRouter);
router.use("/v1/api/inventory", inventoryRouter);
router.use("/v1/api", accessRouter);

export default router;
