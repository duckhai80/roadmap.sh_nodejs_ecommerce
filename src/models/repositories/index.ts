import { QueryParams } from "@/types";
import { formatSelectData, formatUnselectData } from "@/utils";
import { Model, QueryFilter } from "mongoose";

export * from "./inventory.repo";
export * from "./product.repo";

export const findAll = async <T>({
  model,
  filter,
  limit = 50,
  page = 1,
  sort = "ctime",
  select,
  unselect,
}: {
  model: Model<T>;
  select?: string[];
  unselect?: string[];
} & QueryParams<T>) => {
  const skip = (page - 1) * limit;
  const sortBy: { [key: string]: 1 | -1 } =
    sort === "ctime" ? { _id: -1 } : { _id: 1 };

  return await model
    .find(filter)
    .limit(limit)
    .skip(skip)
    .sort(sortBy)
    .select({
      ...formatSelectData(select),
      ...formatUnselectData(unselect),
    })
    .lean();
};

export const findOne = async <T>({
  model,
  filter,
}: {
  model: Model<T>;
  filter: QueryFilter<T>;
}) => {
  return await model.findOne(filter).lean();
};
