import { BadRequestError } from "@/core";
import { clothingModel, updateProduct } from "@/models";
import { ProductType } from "@/types";
import { removeUndefinedNullObject, updateNestedObjectPatch } from "@/utils";
import { ProductFactory, ProductService } from "./product.service";

// Define subclass for type Clothing
export class ClothingService extends ProductService {
  async create() {
    const newClothing = await clothingModel.create({
      ...this.attributes,
      shopId: this.shopId,
    });

    if (!newClothing) throw new BadRequestError("Failed to create clothing");

    const newProduct = await super.create(newClothing._id);

    if (!newProduct) throw new BadRequestError("Failed to create product");

    return newProduct;
  }

  async update(productId: string) {
    const objectPayload = removeUndefinedNullObject(this);

    if (Object.keys(objectPayload.attributes).length > 0) {
      await updateProduct({
        productId,
        payload: updateNestedObjectPatch(objectPayload.attributes),
        model: clothingModel,
      });
    }

    const updatedProduct = await super.update(productId);

    return updatedProduct;
  }
}

ProductFactory.registerProductType(ProductType.CLOTHING, ClothingService);
