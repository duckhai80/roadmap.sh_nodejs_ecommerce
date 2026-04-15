import { commentController } from "@/controllers";
import {
  catchAsync,
  checkAuthentication,
  checkPermission,
} from "@/middlewares";
import express from "express";

const commentRouter = express.Router();

// Check authentication
commentRouter.use(checkPermission("0000"));
commentRouter.use(checkAuthentication);

commentRouter.post("/", catchAsync(commentController.create));
commentRouter.get("/", catchAsync(commentController.findAllByParentId));

export default commentRouter;
