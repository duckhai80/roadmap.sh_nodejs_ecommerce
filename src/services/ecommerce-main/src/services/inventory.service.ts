import { BadRequestError } from "@/core";
import { findOneProduct, inventoryModel } from "@/models";
import { Inventory } from "@/models/inventory.model";
import { QueryFilter, UpdateQuery } from "mongoose";

class InventoryService {
  static async create({
    productId,
    shopId,
    stock,
    location = "Unknown",
  }: {
    productId: string;
    shopId: string;
    stock: number;
    location?: string;
  }) {
    const foundProduct = await findOneProduct({ productId });

    if (!foundProduct) throw new BadRequestError("Product not found");

    const queryFilter: QueryFilter<Inventory> = { productId, shopId };
    const updateQuery: UpdateQuery<Inventory> = {
      $inc: {
        stock,
      },
      $set: {
        location,
      },
    };

    return await inventoryModel.updateOne(queryFilter, updateQuery, {
      upsert: true,
    });
  }
}

export default InventoryService;
