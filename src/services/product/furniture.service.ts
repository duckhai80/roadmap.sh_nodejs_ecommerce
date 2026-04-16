import { BadRequestError } from "@/core";
import { furnitureModel, updateProduct } from "@/models";
import { ProductType } from "@/types";
import { removeUndefinedNullObject, updateNestedObjectPatch } from "@/utils";
import { ProductFactory, ProductService } from "./product.service";

export class FurnitureService extends ProductService {
  async create() {
    const newFurniture = await furnitureModel.create({
      ...this.attributes,
      shopId: this.shopId,
    });

    if (!newFurniture) throw new BadRequestError("Failed to create furniture");

    const newProduct = await super.create(newFurniture._id);

    if (!newProduct) throw new BadRequestError("Failed to create product");

    return newProduct;
  }

  async update(productId: string) {
    const objectPayload = removeUndefinedNullObject(this);

    if (Object.keys(objectPayload.attributes).length > 0) {
      await updateProduct({
        productId,
        payload: updateNestedObjectPatch(objectPayload.attributes),
        model: furnitureModel,
      });
    }

    const updatedProduct = await super.update(productId);

    return updatedProduct;
  }
}

ProductFactory.registerProductType(ProductType.FURNITURE, FurnitureService);
