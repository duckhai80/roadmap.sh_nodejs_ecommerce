import { formatSelectData, formatUnselectData } from "@/utils";
import { Types } from "mongoose";
import { productModel } from "../product";

export const queryProducts = async ({
  filter,
  limit,
  skip,
}: {
  filter: any;
  limit: number;
  skip: number;
}) => {
  return await productModel
    .find(filter)
    .populate("product_shop", "name email -_id")
    .limit(limit)
    .skip(skip)
    .sort({ updatedAt: -1 })
    .lean();
};

export const searchProducts = async (keySearch: string) => {
  const foundProducts = await productModel
    .find(
      {
        isDraft: false,
        $text: { $search: keySearch },
      },
      { score: { $meta: "textScore" } },
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return foundProducts;
};

export const findAllProducts = async ({
  filter,
  limit,
  page,
  sort,
  select,
}: {
  filter: any;
  limit: number;
  page: number;
  sort: string;
  select: string[];
}) => {
  const skip = (page - 1) * limit;
  const sortBy: { [key: string]: 1 | -1 } =
    sort === "ctime" ? { _id: -1 } : { _id: 1 };

  return await productModel
    .find(filter)
    .limit(limit)
    .skip(skip)
    .sort(sortBy)
    .select(formatSelectData(select))
    .lean();
};

export const findProduct = async ({
  product_id,
  unselect,
}: {
  product_id: string;
  unselect: string[];
}) => {
  return await productModel
    .findById(product_id)
    .select(formatUnselectData(unselect))
    .lean();
};

export const findAllDraftProductsByShopId = async ({
  filter,
  limit,
  skip,
}: {
  filter: any;
  limit: number;
  skip: number;
}) => {
  return await queryProducts({ filter, limit, skip });
};

export const findAllPublishedProductsByShopId = async ({
  filter,
  limit,
  skip,
}: {
  filter: any;
  limit: number;
  skip: number;
}) => {
  return await queryProducts({ filter, limit, skip });
};

export const publishProductByShopId = async ({
  product_shop,
  product_id,
}: {
  product_shop: string;
  product_id: string;
}) => {
  const foundShop = await productModel.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

export const unpublishProductByShopId = async ({
  product_shop,
  product_id,
}: {
  product_shop: string;
  product_id: string;
}) => {
  const foundShop = await productModel.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};
