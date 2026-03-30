import { PRODUCT_TYPE } from "@/constants";
import { BadRequestError } from "@/core";
import { clothingModel } from "@/models";
import { ProductFactory, ProductService } from "./product.service";

// Define subclass for type Clothing
export class ClothingService extends ProductService {
  async createProduct() {
    const newClothing = await clothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newClothing) throw new BadRequestError("Failed to create clothing");

    const newProduct = await super.insertProduct(newClothing._id);

    if (!newProduct) throw new BadRequestError("Failed to create product");

    return newProduct;
  }
}

ProductFactory.registerProductType(PRODUCT_TYPE.CLOTHING, ClothingService);
