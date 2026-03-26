import { checkApiKey, checkPermission } from "@/middlewares";
import accessRoute from "@/routes/access";
import express from "express";
import { catchAsync } from "./../middlewares/catchAsync.middleware";
import jwtRouter from "./jwtRoute";

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

router.use("/v1/api", accessRoute);

router.use("/v1/api", jwtRouter);

export default router;
