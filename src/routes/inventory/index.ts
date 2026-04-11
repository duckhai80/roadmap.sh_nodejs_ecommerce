import { inventoryController } from "@/controllers";
import {
  catchAsync,
  checkApiKey,
  checkAuthentication,
  checkPermission,
} from "@/middlewares";
import express from "express";

const inventoryRouter = express.Router();

// Check api key
inventoryRouter.use(catchAsync(checkApiKey));

// Check authentication
inventoryRouter.use(checkPermission("0000"));
inventoryRouter.use(checkAuthentication);

inventoryRouter.post("/", catchAsync(inventoryController.create));

export default inventoryRouter;
