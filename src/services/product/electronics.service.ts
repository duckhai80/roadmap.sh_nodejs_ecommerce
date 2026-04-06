import { ProductType } from "@/constants";
import { BadRequestError } from "@/core";
import { electronicsModel, updateProduct } from "@/models";
import { removeUndefinedNullObject, updateNestedObjectPatch } from "@/utils";
import { ProductFactory, ProductService } from "./product.service";

export class ElectronicsService extends ProductService {
  async create() {
    const newElectronics = await electronicsModel.create({
      ...this.attributes,
      shopId: this.shopId,
    });

    if (!newElectronics)
      throw new BadRequestError("Failed to create electronics");

    const newProduct = await super.create(newElectronics._id);

    if (!newProduct) throw new BadRequestError("Failed to create product");

    return newProduct;
  }

  async update(productId: string) {
    const objectPayload = removeUndefinedNullObject(this);

    if (Object.keys(objectPayload.attributes).length > 0) {
      await updateProduct({
        productId,
        payload: updateNestedObjectPatch(objectPayload.attributes),
        model: electronicsModel,
      });
    }

    const updatedProduct = await super.update(productId);

    return updatedProduct;
  }
}

ProductFactory.registerProductType(ProductType.ELECTRONICS, ElectronicsService);
