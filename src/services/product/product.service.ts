import { BadRequestError } from "@/core";
import {
  findAllDraftProductsByShopId,
  findAllProducts,
  findAllPublishedProductsByShopId,
  findProduct,
  productModel,
  publishProductByShopId,
  searchProducts,
  unpublishProductByShopId,
} from "@/models";
import { Types } from "mongoose";

interface ProductPayload {
  product_name: string;
  product_thumb: string;
  product_description: string;
  product_price: number;
  product_quantity: number;
  product_type: string;
  product_shop?: Types.ObjectId | null;
  product_attributes: any;
}

// Define base product class
export abstract class ProductService {
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
  }: ProductPayload) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    product_shop && (this.product_shop = product_shop);
    this.product_attributes = product_attributes;
  }

  async insertProduct(product_id: Types.ObjectId) {
    return await productModel.create({ ...this, _id: product_id });
  }

  abstract createProduct(): Promise<any>;

  // Find all products
  static async findAllProducts({
    filter = { isPublished: true },
    limit = 50,
    page = 1,
    sort = "ctime",
  }: {
    filter: any;
    limit?: number;
    page?: number;
    sort?: string;
  }) {
    return await findAllProducts({
      filter,
      limit,
      page,
      sort,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  // Find product
  static async findProduct({ product_id }: { product_id: string }) {
    return await findProduct({ product_id, unselect: ["__v"] });
  }

  // Update product
  static async updateProduct() {}

  // Find all draft products by shop id
  static async findAllDraftProductsByShopId({
    product_shop,
    limit = 50,
    skip = 0,
  }: {
    product_shop: string;
    limit?: number;
    skip?: number;
  }) {
    const filter = { product_shop, isDraft: true };

    return await findAllDraftProductsByShopId({ filter, limit, skip });
  }

  // Find all published products by shop id
  static async findAllPublishedProductsByShopId({
    product_shop,
    limit = 50,
    skip = 0,
  }: {
    product_shop: string;
    limit?: number;
    skip?: number;
  }) {
    const filter = { product_shop, isPublished: true };

    return await findAllPublishedProductsByShopId({ filter, limit, skip });
  }

  // Publish product by shop id
  static async publishProductByShopId({
    product_shop,
    product_id,
  }: {
    product_shop: string;
    product_id: string;
  }) {
    return await publishProductByShopId({ product_shop, product_id });
  }

  // Unpublish product by shop id
  static async unpublishProductByShopId({
    product_shop,
    product_id,
  }: {
    product_shop: string;
    product_id: string;
  }) {
    return await unpublishProductByShopId({ product_shop, product_id });
  }

  // Search products
  static async searchProducts(keySearch: string) {
    return await searchProducts(keySearch);
  }
}

type ProductServiceConstructor = new (
  payload: ProductPayload,
) => ProductService;

export class ProductFactory {
  /* Use simple factory pattern */
  // static async createProduct(type: PRODUCT_TYPE, payload: Product) {
  //   switch (type) {
  //     case PRODUCT_TYPE.CLOTHING:
  //       return new ClothingService(payload).createProduct();
  //     case PRODUCT_TYPE.ELECTRONICS:
  //       return new ElectronicsService(payload).createProduct();
  //     default:
  //       throw new BadRequestError("Invalid product type");
  //   }
  // }

  /* Use factory method pattern */
  private static productRegistry: Map<string, ProductServiceConstructor> =
    new Map();

  static registerProductType(
    type: string,
    classRef: ProductServiceConstructor,
  ) {
    ProductFactory.productRegistry.set(type, classRef);
  }

  static createProduct(type: string, payload: ProductPayload) {
    const productTypeClass = ProductFactory.productRegistry.get(type);

    if (!productTypeClass) throw new BadRequestError(`Invalid type: ${type}`);

    return new productTypeClass(payload).createProduct();
  }
}
