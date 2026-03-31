import { SuccessResponse } from "@/core";
import { ProductFactory, ProductService } from "@/services";
import { Request, Response } from "express";

class ProductController {
  create = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Create new product success",
      status: 201,
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.shop.shopId,
      }),
    }).send(res);
  };

  getAllProducts = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Get all products success",
      status: 200,
      metadata: await ProductService.findAllProducts({
        filter: req.query,
      }),
    }).send(res);
  };

  getProduct = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Get product success",
      status: 200,
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id as string,
      }),
    }).send(res);
  };

  getAllDraftsByShopId = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Found draft products success",
      status: 200,
      metadata: await ProductService.findAllDraftProductsByShopId({
        product_shop: req.shop.shopId,
      }),
    }).send(res);
  };

  getAllPublishedByShopId = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Found published products success",
      status: 200,
      metadata: await ProductService.findAllPublishedProductsByShopId({
        product_shop: req.shop.shopId,
      }),
    }).send(res);
  };

  publishProductByShopId = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Publish product success",
      status: 200,
      metadata: await ProductService.publishProductByShopId({
        product_id: req.params.id as string,
        product_shop: req.shop.shopId,
      }),
    }).send(res);
  };

  unpublishProductByShopId = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Unpublish product success",
      status: 200,
      metadata: await ProductService.unpublishProductByShopId({
        product_id: req.params.id as string,
        product_shop: req.shop.shopId,
      }),
    }).send(res);
  };

  getAllSearchProducts = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Found search products success",
      status: 200,
      metadata: await ProductService.searchProducts(
        req.params.keySearch as string,
      ),
    }).send(res);
  };
}

export default new ProductController();
