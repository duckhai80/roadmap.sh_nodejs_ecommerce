import { SuccessResponse } from "@/core";
import { ProductFactory, ProductService } from "@/services";
import { Request, Response } from "express";

class ProductController {
  create = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Product created successfully",
      status: 201,
      metadata: await ProductFactory.create(req.body.type, {
        ...req.body,
        shopId: req.shop.shopId,
      }),
    }).send(res);
  };

  update = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Product updated successfully",
      status: 200,
      metadata: await ProductFactory.update(
        req.body.type,
        req.params.productId as string,
        {
          ...req.body,
          shopId: req.shop.shopId,
        },
      ),
    }).send(res);
  };

  findAll = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Products fetched successfully",
      status: 200,
      metadata: await ProductService.findAll({
        filter: req.query,
      }),
    }).send(res);
  };

  findOne = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Product fetched successfully",
      status: 200,
      metadata: await ProductService.findOne({
        productId: req.params.productId as string,
      }),
    }).send(res);
  };

  findAllDrafts = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Draft products fetched successfully",
      status: 200,
      metadata: await ProductService.findAllDrafts({
        shopId: req.shop.shopId,
      }),
    }).send(res);
  };

  findAllPublished = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Published products fetched successfully",
      status: 200,
      metadata: await ProductService.findAllPublished({
        shopId: req.shop.shopId,
      }),
    }).send(res);
  };

  publish = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Product published successfully",
      status: 200,
      metadata: await ProductService.publish({
        productId: req.params.productId as string,
        shopId: req.shop.shopId,
      }),
    }).send(res);
  };

  unpublish = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Product unpublished successfully",
      status: 200,
      metadata: await ProductService.unpublish({
        productId: req.params.productId as string,
        shopId: req.shop.shopId,
      }),
    }).send(res);
  };

  search = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Search products successfully",
      status: 200,
      metadata: await ProductService.search(req.params.keySearch as string),
    }).send(res);
  };
}

export default new ProductController();
