import { Types } from "mongoose";
import inventoryModel from "../inventory.model";
import { convertToObjectId } from "@/utils";

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
