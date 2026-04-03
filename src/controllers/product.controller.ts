import { SuccessResponse } from "@/core";
import { ProductFactory, ProductService } from "@/services";
import { Request, Response } from "express";

class ProductController {
  create = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Create new product success",
      status: 201,
      metadata: await ProductFactory.create(req.body.type, {
        ...req.body,
        shopId: req.shop.shopId,
      }),
    }).send(res);
  };

  update = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Update product success",
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
      message: "Get all products success",
      status: 200,
      metadata: await ProductService.findAll({
        filter: req.query,
      }),
    }).send(res);
  };

  findOne = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Get product success",
      status: 200,
      metadata: await ProductService.findOne({
        productId: req.params.productId as string,
      }),
    }).send(res);
  };

  findAllDrafts = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Found draft products success",
      status: 200,
      metadata: await ProductService.findAllDrafts({
        shopId: req.shop.shopId,
      }),
    }).send(res);
  };

  findAllPublished = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Found published products success",
      status: 200,
      metadata: await ProductService.findAllPublished({
        shopId: req.shop.shopId,
      }),
    }).send(res);
  };

  publish = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Publish product success",
      status: 200,
      metadata: await ProductService.publish({
        productId: req.params.productId as string,
        shopId: req.shop.shopId,
      }),
    }).send(res);
  };

  unpublish = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Unpublish product success",
      status: 200,
      metadata: await ProductService.unpublish({
        productId: req.params.productId as string,
        shopId: req.shop.shopId,
      }),
    }).send(res);
  };

  search = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Found search products success",
      status: 200,
      metadata: await ProductService.search(req.params.keySearch as string),
    }).send(res);
  };
}

export default new ProductController();
