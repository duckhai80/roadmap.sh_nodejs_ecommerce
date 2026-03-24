import express from "express";
import accessRoute from "@/routes/access";
import jwtRouter from "./jwtRoute";

const router = express.Router();

router.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello world!",
  });
});

router.use("/v1/api", accessRoute);

router.use("/v1/api", jwtRouter);

export default router;
