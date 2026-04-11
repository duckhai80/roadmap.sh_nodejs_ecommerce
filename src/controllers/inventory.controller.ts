import { SuccessResponse } from "@/core";
import { InventoryService } from "@/services";
import { Request, Response } from "express";

class InventoryController {
  create = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Inventory created successfully",
      status: 201,
      metadata: await InventoryService.create(req.body),
    }).send(res);
  };
}

export default new InventoryController();
