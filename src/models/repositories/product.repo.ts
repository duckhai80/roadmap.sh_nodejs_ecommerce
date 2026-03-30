import { Types } from "mongoose";
import { productModel } from "../product";

export const queryProducts = async ({
  query,
  limit,
  skip,
}: {
  query: any;
  limit: number;
  skip: number;
}) => {
  return await productModel
    .find(query)
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

export const findAllDraftProductsByShopId = async ({
  query,
  limit,
  skip,
}: {
  query: any;
  limit: number;
  skip: number;
}) => {
  return await queryProducts({ query, limit, skip });
};

export const findAllPublishedProductsById = async ({
  query,
  limit,
  skip,
}: {
  query: any;
  limit: number;
  skip: number;
}) => {
  return await queryProducts({ query, limit, skip });
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
