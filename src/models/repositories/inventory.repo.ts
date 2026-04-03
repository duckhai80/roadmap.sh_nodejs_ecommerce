import { Types } from "mongoose";
import inventoryModel from "../inventory.model";

export const createInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}: {
  productId: string;
  shopId: string;
  stock: number;
  location?: string;
}) => {
  return await inventoryModel.create({
    productId: new Types.ObjectId(productId),
    shopId: new Types.ObjectId(shopId),
    stock,
    location,
  });
};
