import { convertToObjectId } from "@/utils";
import { QueryFilter, Types, UpdateQuery } from "mongoose";
import inventoryModel, { Inventory } from "../inventory.model";

export const createInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}: {
  productId: string | Types.ObjectId;
  shopId: string | Types.ObjectId;
  stock: number;
  location?: string;
}) => {
  return await inventoryModel.create({
    productId: convertToObjectId(productId),
    shopId: convertToObjectId(shopId),
    stock,
    location,
  });
};

export const reserveInventory = async ({
  cartId,
  productId,
  quantity,
}: {
  cartId: string;
  productId: string;
  quantity: number;
}) => {
  const queryFilter: QueryFilter<Inventory> = {
    productId: convertToObjectId(productId),
    stock: { $gte: quantity },
  };
  const updateQuery: UpdateQuery<Inventory> = {
    $inc: {
      stock: -quantity,
    },
    $push: {
      reservations: {
        quantity,
        cartId,
        createdOn: new Date(),
      },
    },
  };

  return await inventoryModel.updateOne(queryFilter, updateQuery, {
    upsert: true,
  });
};
