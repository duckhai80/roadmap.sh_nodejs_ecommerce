import { Types } from "mongoose";
import discountModel from "../discount.model";
import { convertToObjectId } from "./../../utils/dataFormat.util";

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
