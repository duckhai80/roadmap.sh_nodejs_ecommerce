import { SuccessResponse } from "@/core";
import { Cart } from "@/models/cart.model";
import { CartService } from "@/services";
import { QueryParams } from "@/types";
import { NextFunction, Request, Response } from "express";

export class CartController {
  findOne = async (req: Request, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: "Cart fetched successfully",
      status: 200,
      metadata: await CartService.findOne({
        userId: (req.query as QueryParams<Cart>)?.userId,
      }),
    }).send(res);
  };

  addToCart = async (req: Request, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: "Add to cart successfully",
      status: 201,
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: "Product in cart updated successfully",
      status: 200,
      metadata: await CartService.updateProduct(req.body),
    }).send(res);
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: "Delete from cart successfully",
      status: 200,
      metadata: await CartService.deleteProduct(req.body),
    }).send(res);
  };
}

export default new CartController();
