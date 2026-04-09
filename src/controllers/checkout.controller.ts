import { SuccessResponse } from "@/core";
import { CheckoutService } from "@/services";
import { NextFunction, Request, Response } from "express";

class CheckoutController {
  checkReview = async (req: Request, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: "Checkout review successfully",
      status: 200,
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };
}

export default new CheckoutController();
