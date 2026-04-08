import { SuccessResponse } from "@/core";
import { Discount } from "@/models/discount.model";
import { DiscountService } from "@/services";
import { QueryParams } from "@/types";
import { NextFunction, Request, Response } from "express";

class DiscountController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: "Discount code created successfully",
      status: 201,
      metadata: await DiscountService.create({
        ...req.body,
        shopId: req.shop.shopId,
      }),
    }).send(res);
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: "Discount deleted successfully",
      status: 200,
      metadata: await DiscountService.delete({
        code: req.body.code,
        shopId: req.shop.shopId,
      }),
    }).send(res);
  };

  findAllByShopId = async (req: Request, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: "Discount codes fetched successfully",
      status: 200,
      metadata: await DiscountService.findAllByShopId({
        ...(req.query as QueryParams<Discount>),
        shopId: req.shop.shopId,
      }),
    }).send(res);
  };

  getAmount = async (req: Request, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: "Discount amount calculated successfully",
      status: 200,
      metadata: await DiscountService.calculateDiscountAmount(req.body),
    }).send(res);
  };

  findAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: "Discount products fetched successfully",
      status: 200,
      metadata: await DiscountService.findAllProducts({
        ...(req.query as QueryParams<Discount>),
        shopId: req.query.shopId as string,
        code: req.query.code as string,
      }),
    }).send(res);
  };
}

export default new DiscountController();
