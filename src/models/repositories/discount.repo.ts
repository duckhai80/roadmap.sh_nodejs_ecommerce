import { convertToObjectId } from "@/utils";
import { Types } from "mongoose";
import discountModel from "../discount.model";

export const findAllDiscountByShopIdAndCode = async ({
  shopId,
  code,
}: {
  shopId: string | Types.ObjectId;
  code: string;
}) => {
  const foundDiscount = await discountModel
    .findOne({
      shopId: convertToObjectId(shopId),
      code,
    })
    .lean();

  return foundDiscount;
};
