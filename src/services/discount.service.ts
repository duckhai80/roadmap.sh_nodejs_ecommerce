/* 
  - Generate discount code (admin/shop)
  - Delete discount code (admin/shop)
  - Get all discount codes (shop/user)
  - Get discount amount (user)
  - Verify discount code (user)
  - Cancel discount code (user)
*/

import { BadRequestError, NotFoundError } from "@/core";
import { discountModel, findAll, findAllProducts } from "@/models";
import { ApplyTo, Discount } from "@/models/discount.model";
import { Product } from "@/models/product/product.model";
import { findAllDiscountByShopIdAndCode } from "@/models/repositories/discount.repo";
import { convertToObjectId } from "@/utils";

export class DiscountService {
  // Generate discount code
  static async create(payload: Discount) {
    const {
      shopId,
      name,
      description,
      type,
      value,
      code,
      startDate,
      endDate,
      maxUses,
      maxUsesPerUser,
      minOrderValue,
      usesCount,
      usersUsed,
      isActive,
      appliesTo,
    } = payload;

    if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
      throw new BadRequestError("Discount code is expired or not yet active");
    }

    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestError("Start date must be before end date");
    }

    // Check duplicate discount code
    const foundDiscount = await findAllDiscountByShopIdAndCode({
      shopId: shopId!,
      code,
    });

    if (foundDiscount) {
      throw new BadRequestError("Discount code already exists");
    }

    const newDiscount = await discountModel.create({
      shopId: convertToObjectId(shopId!),
      name,
      description: description || "",
      type,
      value,
      code,
      startDate: new Date(startDate),
      endDate: new Date(endDate),

      maxUses,
      maxUsesPerUser,
      minOrderValue,
      usesCount,
      usersUsed,

      isActive,
      appliesTo,
      appliesToProduct: appliesTo === ApplyTo.ALL ? [] : ["productId"],
    });

    return newDiscount;
  }

  static async update() {}

  // Get all available products with code
  static async findAllProducts({
    shopId,
    userId,
    code,
    limit,
    page,
  }: {
    shopId: string;
    userId?: string;
    code: string;
    limit: number;
    page: number;
  }) {
    const foundDiscount = await findAllDiscountByShopIdAndCode({
      shopId: shopId!,
      code,
    });

    if (!foundDiscount || !foundDiscount?.isActive) {
      throw new NotFoundError("Discount code is not found or not active");
    }

    const { appliesTo, appliesToProduct } = foundDiscount;
    let products: Product[] = [];

    if (appliesTo === ApplyTo.ALL) {
      products = await findAllProducts({
        filter: {
          shopId: convertToObjectId(shopId!),
          isPublished: true,
        },
        limit,
        page,
        sort: "ctime",
        select: ["name"],
      });
    }

    if (appliesTo === ApplyTo.SPECIFIC) {
      products = await findAllProducts({
        filter: {
          _id: { $in: appliesToProduct },
        },
        limit,
        page,
        sort: "ctime",
        select: ["name"],
      });
    }

    return products;
  }

  // Get all discounts of shop
  static async findAllByShopId({
    shopId,
    page,
    limit,
    sort,
  }: {
    shopId: string;
    page: number;
    limit: number;
    sort: string;
  }) {
    const discounts = await findAll({
      model: discountModel,
      filter: {
        shopId: convertToObjectId(shopId),
      },
      limit,
      page,
      sort,
      unselect: ["__v", "shopId"],
    });

    return discounts;
  }
}
