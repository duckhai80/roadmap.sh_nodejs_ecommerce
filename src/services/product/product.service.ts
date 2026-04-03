import { PRODUCT_TYPE } from "@/constants";
import { BadRequestError } from "@/core";
import {
  createInventory,
  findAllDraftProducts,
  findAllProducts,
  findAllPublishedProducts,
  findProduct,
  productModel,
  publishProduct,
  searchProducts,
  unpublishProduct,
  updateProduct,
} from "@/models";
import { updateNestedObjectPatch } from "@/utils";
import { Types } from "mongoose";

interface ProductPayload {
  name: string;
  thumbnail: string;
  description: string;
  price: number;
  quantity: number;
  type: string;
  shopId?: Types.ObjectId | null;
  attributes: any;
}

// Define base product class
export abstract class ProductService {
  name: string;
  thumbnail: string;
  description: string;
  price: number;
  quantity: number;
  type: string;
  shopId?: Types.ObjectId | null;
  attributes: any;

  constructor({
    name,
    thumbnail,
    description,
    price,
    quantity,
    type,
    shopId,
    attributes,
  }: ProductPayload) {
    this.name = name;
    this.thumbnail = thumbnail;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.type = type;
    shopId && (this.shopId = shopId);
    this.attributes = attributes;
  }

  // Create product
  async create(productId: Types.ObjectId) {
    const newProduct = await productModel.create({ ...this, _id: productId });

    if (newProduct) {
      await createInventory({
        productId: newProduct._id.toString(),
        shopId: this.shopId!.toString(),
        stock: this.quantity,
        location: this.attributes.location,
      });
    }

    return newProduct;
  }

  // Update product
  async update(productId: string) {
    return await updateProduct({
      productId,
      payload: updateNestedObjectPatch(this),
      model: productModel,
    });
  }

  // Find all products
  static async findAll({
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
      select: ["name", "price", "thumbnail"],
    });
  }

  // Find product
  static async findOne({ productId }: { productId: string }) {
    return await findProduct({ productId, unselect: ["__v"] });
  }

  // Find all draft products by shop id
  static async findAllDrafts({
    shopId,
    limit = 50,
    skip = 0,
  }: {
    shopId: string;
    limit?: number;
    skip?: number;
  }) {
    const filter = { shopId, isDraft: true };

    return await findAllDraftProducts({ filter, limit, skip });
  }

  // Find all published products by shop id
  static async findAllPublished({
    shopId,
    limit = 50,
    skip = 0,
  }: {
    shopId: string;
    limit?: number;
    skip?: number;
  }) {
    const filter = { shopId, isPublished: true };

    return await findAllPublishedProducts({ filter, limit, skip });
  }

  // Publish product by shop id
  static async publish({
    shopId,
    productId,
  }: {
    shopId: string;
    productId: string;
  }) {
    return await publishProduct({ shopId, productId });
  }

  // Unpublish product by shop id
  static async unpublish({
    shopId,
    productId,
  }: {
    shopId: string;
    productId: string;
  }) {
    return await unpublishProduct({ shopId, productId });
  }

  // Search products
  static async search(keySearch: string) {
    return await searchProducts(keySearch);
  }
}

type ProductServiceConstructor = new (payload: ProductPayload) => {
  create(): Promise<any>;
  update(productId: string): Promise<any>;
};

export class ProductFactory {
  /* Use simple factory pattern */
  // static async create(type: PRODUCT_TYPE, payload: Product) {
  //   switch (type) {
  //     case PRODUCT_TYPE.CLOTHING:
  //       return new ClothingService(payload).create();
  //     case PRODUCT_TYPE.ELECTRONICS:
  //       return new ElectronicsService(payload).create();
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

  static create(type: PRODUCT_TYPE, payload: ProductPayload) {
    const productTypeClass = ProductFactory.productRegistry.get(type);

    if (!productTypeClass) throw new BadRequestError(`Invalid type: ${type}`);

    return new productTypeClass(payload).create();
  }

  static update(
    type: PRODUCT_TYPE,
    productId: string,
    payload: ProductPayload,
  ) {
    const productTypeClass = ProductFactory.productRegistry.get(type);

    if (!productTypeClass) throw new BadRequestError(`Invalid type: ${type}`);

    return new productTypeClass(payload).update(productId);
  }
}
