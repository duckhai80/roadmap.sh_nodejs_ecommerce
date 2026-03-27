import { Request } from "express";
import { Response } from "express";
import { SuccessResponse } from "@/core";
import { ProductFactory } from "@/services";

class ProductController {
  create = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Create new product success",
      status: 201,
      metadata: await ProductFactory.createProduct(
        req.body.product_type,
        req.body,
      ),
    }).send(res);
  };
}

export default new ProductController();
