import { inventoryController } from "@/controllers";
import {
  catchAsync,
  checkAuthentication,
  checkPermission,
} from "@/middlewares";
import express from "express";

const inventoryRouter = express.Router();

// Check authentication
inventoryRouter.use(checkPermission("0000"));
inventoryRouter.use(checkAuthentication);

inventoryRouter.post("/", catchAsync(inventoryController.create));

export default inventoryRouter;
