import { SuccessResponse } from "@/core";
import { NotificationService } from "@/services";
import { Request, Response } from "express";

class NotificationController {
  findAllByUserId = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Notification fetched successfully",
      status: 200,
      metadata: await NotificationService.findAllByUserId(req.query),
    }).send(res);
  };
}

export default new NotificationController();
