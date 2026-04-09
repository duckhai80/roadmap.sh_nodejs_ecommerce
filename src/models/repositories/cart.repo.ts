import { CartStatus } from "@/types";
import { convertToObjectId } from "@/utils";
import cartModel from "../cart.model";

export const findOneCartById = async (cartId: string) => {
  return await cartModel
    .findOne({ _id: convertToObjectId(cartId), status: CartStatus.ACTIVE })
    .lean();
};
