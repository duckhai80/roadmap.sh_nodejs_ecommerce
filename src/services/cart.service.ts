/* 
  - Add product to cart (user)
  - Reduce product quantity
  - Increase product quantity
  - Get cart
  - Delete cart
  - Delete cart by item
*/

import { BadRequestError, NotFoundError } from "@/core";
import { productModel } from "@/models";
import cartModel, { Cart, CartStatus } from "@/models/cart.model";
import { CartOrder, CartProduct } from "@/types";
import { convertToObjectId } from "@/utils";
import { QueryFilter, QueryOptions, UpdateQuery } from "mongoose";

class CartService {
  static async findOne({ userId }: { userId: string }) {
    return await cartModel.findOne({ userId }).lean();
  }

  static async create({
    userId,
    product,
  }: {
    userId: string;
    product: CartProduct;
  }) {
    const queryFilter: QueryFilter<Cart> = {
      userId,
      status: CartStatus.ACTIVE,
    };
    const updateQuery: UpdateQuery<Cart> = {
      $addToSet: {
        products: product,
      },
    };
    const queryOptions: QueryOptions<Cart> = {
      upsert: true,
      new: true,
    };

    return await cartModel.findOneAndUpdate(
      queryFilter,
      updateQuery,
      queryOptions,
    );
  }

  static async addToCart({
    userId,
    product,
  }: {
    userId: string;
    product: CartProduct;
  }) {
    const foundCart = await cartModel.findOne({
      userId,
    });

    // Check if has no cart
    if (!foundCart) {
      return await this.create({ userId, product });
    }

    // Check if cart exist
    const hasProduct = foundCart.products.find(
      (cartProduct) => cartProduct.productId === product.productId,
    );

    if (hasProduct) {
      return await this.updateProductQuantity({ userId, product });
    } else {
      foundCart.products.push(product);
      return await foundCart.save();
    }
  }

  static async updateProduct({
    userId,
    cartOrders,
  }: {
    userId: string;
    cartOrders: CartOrder[];
  }) {
    const { productId, shopId, quantity, oldQuantity } =
      cartOrders[0]?.products[0]!;
    const foundProduct = await productModel.findById(
      convertToObjectId(productId),
    );

    if (!foundProduct) {
      throw new NotFoundError("Product not found");
    }

    if (foundProduct.shopId?.toString() !== shopId) {
      throw new BadRequestError("Invalid product");
    }

    if (quantity === 0) {
      return await this.deleteProduct({ userId, productId });
    }

    return await this.updateProductQuantity({
      userId,
      product: {
        shopId,
        productId,
        quantity: quantity - (oldQuantity ?? 0),
      },
    });
  }

  static async updateProductQuantity({
    userId,
    product,
  }: {
    userId: string;
    product: CartProduct;
  }) {
    const { productId, quantity } = product;
    const queryFilter: QueryFilter<Cart> = {
      userId,
      "products.productId": productId,
      status: CartStatus.ACTIVE,
    };
    const updateQuery: UpdateQuery<Cart> = {
      $inc: {
        "products.$.quantity": quantity,
      },
    };
    const queryOptions: QueryOptions<Cart> = {
      upsert: true,
      new: true,
    };

    return await cartModel.findOneAndUpdate(
      queryFilter,
      updateQuery,
      queryOptions,
    );
  }

  static async deleteProduct({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }) {
    const queryFilter: QueryFilter<Cart> = {
      userId,
      status: CartStatus.ACTIVE,
    };
    const updateQuery: UpdateQuery<Cart> = {
      $pull: {
        products: { productId },
      },
    };

    return await cartModel.updateOne(queryFilter, updateQuery);
  }
}

export default CartService;
