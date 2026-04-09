import { QueryParams } from "@/types";
import { formatSelectData, formatUnselectData } from "@/utils";
import {
  Model,
  PopulateOptions,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
} from "mongoose";

export * from "./cart.repo";
export * from "./discount.repo";
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
  populateOptions,
}: {
  model: Model<T>;
  filter: QueryFilter<T>;
  populateOptions?: PopulateOptions[];
}) => {
  const query = model.findOne(filter);

  if (populateOptions) {
    query.populate(populateOptions);
  }

  return await query.lean();
};

export const create = async <T>({
  model,
  document,
}: {
  model: Model<T>;
  document: T;
}) => {
  return await model.create(document);
};

export const update = async <T>({
  model,
  filterQuery,
  updateQuery,
  queryOptions,
}: {
  model: Model<T>;
  filterQuery: QueryFilter<T>;
  updateQuery: UpdateQuery<T>;
  queryOptions?: QueryOptions<T>;
}) => {
  return await model.findOneAndUpdate(filterQuery, updateQuery, queryOptions);
};

export const deleteOne = async <T>({
  model,
  filterQuery,
}: {
  model: Model<T>;
  filterQuery: QueryFilter<T>;
}) => {
  return await model.deleteOne(filterQuery);
};
