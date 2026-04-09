/* 
  - Generate discount code (admin/shop)
  - Delete discount code (admin/shop)
  - Get all discount codes (shop/user)
  - Get discount amount (user)
  - Verify discount code (user)
  - Cancel discount code (user)
*/

import { BadRequestError, NotFoundError } from "@/core";
import {
  discountModel,
  findAll,
  findAllDiscountByShopIdAndCode,
  findAllProducts,
  findOne,
} from "@/models";
import { ApplyTo, Discount, DiscountType } from "@/models/discount.model";
import { Product } from "@/models/product/product.model";
import { QueryParams } from "@/types";
import { convertToObjectId } from "@/utils";

export class DiscountService {
  // Generate discount code (admin/shop)
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
      appliesToProduct,
    } = payload;

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
      appliesToProduct: appliesTo === ApplyTo.ALL ? [] : appliesToProduct,
    });

    return newDiscount;
  }

  static async update() {}

  static async delete({ shopId, code }: { shopId: string; code: string }) {
    await discountModel.findOneAndDelete({
      shopId: convertToObjectId(shopId),
      code,
    });

    return null;
  }

  static async cancel({
    shopId,
    code,
    userId,
  }: {
    shopId: string;
    code: string;
    userId?: string;
  }) {
    const foundDiscount = await findAllDiscountByShopIdAndCode({
      shopId: convertToObjectId(shopId),
      code,
    });

    if (!foundDiscount) throw new NotFoundError("Discount code not found");

    const resultCancel = await discountModel.findByIdAndUpdate(
      foundDiscount._id,
      {
        $pull: {
          usersUsed: userId,
        },
        $inc: {
          maxUses: 1,
          usesCount: -1,
        },
      },
    );

    return resultCancel;
  }

  // Get all available products with code
  static async findAllProducts({
    shopId,
    userId,
    code,
    limit = 50,
    page = 1,
  }: {
    shopId: string;
    userId?: string;
    code: string;
    // limit: number;
    // page: number;
  } & QueryParams<Discount>) {
    const foundDiscount = await findAllDiscountByShopIdAndCode({
      shopId: convertToObjectId(shopId),
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
    page = 1,
    limit = 50,
    sort = "ctime",
  }: QueryParams<Discount>) {
    const discounts = await findAll({
      model: discountModel,
      filter: {
        shopId: convertToObjectId(shopId),
      },
      limit,
      page,
      sort,
      select: ["code", "name"],
      unselect: ["_id"],
    });

    return discounts;
  }

  // get discount amount
  static async calculateDiscountAmount({
    shopId,
    userId,
    code,
    products,
  }: {
    shopId: string;
    userId: string;
    code: string;
    products: Product[];
  }) {
    const foundDiscount = await findOne({
      model: discountModel,
      filter: {
        shopId: convertToObjectId(shopId),
        code,
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount code is not found");
    }

    const {
      type,
      startDate,
      endDate,
      value,
      maxUses,
      maxUsesPerUser,
      minOrderValue,
      usersUsed,
      isActive,
    } = foundDiscount;

    if (new Date() < new Date(startDate) || new Date() > new Date(endDate))
      throw new NotFoundError("Discount code is expired or not yet active");
    if (!maxUses) throw new NotFoundError("Discount code is out");
    if (!isActive) throw new NotFoundError("Discount code is not active");

    // Check the min value of order
    let totalOrderValue = 0;

    if (minOrderValue > 0) {
      totalOrderValue = products.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0,
      );

      if (totalOrderValue < minOrderValue)
        throw new NotFoundError(
          `Discount requires a minimum value of ${minOrderValue}`,
        );
    }

    if (maxUsesPerUser > 0) {
      const userUsesCount = usersUsed.find((user) => user.userId === userId);

      if (userUsesCount === 1) {
      }
    }

    // Calculate discount amount
    const discountAmount =
      type === DiscountType.FIXED_AMOUNT
        ? value
        : totalOrderValue * (value / 100);

    return {
      totalOrderValue,
      discountAmount,
      totalPrice: totalOrderValue - discountAmount,
    };
  }
}

export default DiscountService;
