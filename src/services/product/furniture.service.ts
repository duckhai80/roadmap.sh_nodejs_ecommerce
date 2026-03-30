import { PRODUCT_TYPE } from "@/constants";
import { BadRequestError } from "@/core";
import { furnitureModel } from "@/models";
import { ProductFactory, ProductService } from "./product.service";

export class FurnitureService extends ProductService {
  async createProduct() {
    const newFurniture = await furnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newFurniture) throw new BadRequestError("Failed to create furniture");

    const newProduct = await super.insertProduct(newFurniture._id);

    if (!newProduct) throw new BadRequestError("Failed to create product");

    return newProduct;
  }
}

ProductFactory.registerProductType(PRODUCT_TYPE.FURNITURE, FurnitureService);
