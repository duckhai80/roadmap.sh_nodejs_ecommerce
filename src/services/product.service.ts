import { PRODUCT_TYPE } from "@/constants";
import { BadRequestError } from "@/core";
import { clothingModel, electronicsModel, productModel } from "@/models";
import { Product } from "@/models/products/product.model";
import { Types } from "mongoose";

// Define base product class
class ProductService {
  product_name: string;
  product_thumb: string;
  product_description: string;
  product_price: number;
  product_quantity: number;
  product_type: string;
  product_shop?: Types.ObjectId | null;
  product_attributes: any;

  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }: {
    product_name: string;
    product_thumb: string;
    product_description: string;
    product_price: number;
    product_quantity: number;
    product_type: string;
    product_shop?: Types.ObjectId | null;
    product_attributes: any;
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    product_shop && (this.product_shop = product_shop);
    this.product_attributes = product_attributes;
  }

  async createProduct() {
    return await productModel.create(this);
  }
}

// Define subclass for type Clothing
class ClothingService extends ProductService {
  async createProduct() {
    const newClothing = await clothingModel.create(this.product_attributes);

    if (!newClothing) throw new BadRequestError("Failed to create clothing");

    const newProduct = await super.createProduct();

    if (!newProduct) throw new BadRequestError("Failed to create product");

    return newProduct;
  }
}

// Define subclass for type Electronics
class ElectronicsService extends ProductService {
  async createProduct() {
    const newElectronics = await electronicsModel.create(
      this.product_attributes,
    );

    if (!newElectronics)
      throw new BadRequestError("Failed to create electronics");

    const newProduct = await super.createProduct();

    if (!newProduct) throw new BadRequestError("Failed to create product");

    return newProduct;
  }
}

export class ProductFactory {
  static async createProduct(type: PRODUCT_TYPE, payload: Product) {
    switch (type) {
      case PRODUCT_TYPE.CLOTHING:
        return new ClothingService(payload).createProduct();
      case PRODUCT_TYPE.ELECTRONICS:
        return new ElectronicsService(payload).createProduct();
      default:
        throw new BadRequestError("Invalid product type");
    }
  }
}
