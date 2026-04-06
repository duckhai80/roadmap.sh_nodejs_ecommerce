import {
  convertToObjectId,
  formatSelectData,
  formatUnselectData,
} from "@/utils";
import { Model, QueryFilter } from "mongoose";
import { productModel } from "../product";
import { Product } from "../product/product.model";

export const queryProducts = async ({
  filter,
  limit,
  skip,
}: {
  filter: QueryFilter<Product>;
  limit: number;
  skip: number;
}) => {
  return await productModel
    .find(filter)
    .populate("shopId", "name email -_id")
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
  filter: QueryFilter<Product>;
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
  productId,
  unselect,
}: {
  productId: string;
  unselect: string[];
}) => {
  return await productModel
    .findById(productId)
    .populate("shopId", "name email -_id")
    .select(formatUnselectData(unselect))
    .lean();
};

export const updateProduct = async ({
  productId,
  payload,
  model,
  isNew = true,
}: {
  productId: string;
  payload: QueryFilter<Product>;
  model: Model<any>;
  isNew?: boolean;
}) => {
  return await model
    .findByIdAndUpdate(convertToObjectId(productId), payload, {
      new: isNew,
    })
    .lean();
};

export const findAllDraftProducts = async ({
  filter,
  limit,
  skip,
}: {
  filter: QueryFilter<Product>;
  limit: number;
  skip: number;
}) => {
  return await queryProducts({ filter, limit, skip });
};

export const findAllPublishedProducts = async ({
  filter,
  limit,
  skip,
}: {
  filter: QueryFilter<Product>;
  limit: number;
  skip: number;
}) => {
  return await queryProducts({ filter, limit, skip });
};

export const publishProduct = async ({
  shopId,
  productId,
}: {
  shopId: string;
  productId: string;
}) => {
  const foundShop = await productModel.findOne({
    shopId: convertToObjectId(shopId),
    _id: convertToObjectId(productId),
  });

  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

export const unpublishProduct = async ({
  shopId,
  productId,
}: {
  shopId: string;
  productId: string;
}) => {
  const foundShop = await productModel.findOne({
    shopId: convertToObjectId(shopId),
    _id: convertToObjectId(productId),
  });

  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};
