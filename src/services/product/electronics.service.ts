import { PRODUCT_TYPE } from "@/constants";
import { BadRequestError } from "@/core";
import { electronicsModel } from "@/models";
import { ProductFactory, ProductService } from "./product.service";

export class ElectronicsService extends ProductService {
  async createProduct() {
    const newElectronics = await electronicsModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newElectronics)
      throw new BadRequestError("Failed to create electronics");

    const newProduct = await super.insertProduct(newElectronics._id);

    if (!newProduct) throw new BadRequestError("Failed to create product");

    return newProduct;
  }
}

ProductFactory.registerProductType(
  PRODUCT_TYPE.ELECTRONICS,
  ElectronicsService,
);
