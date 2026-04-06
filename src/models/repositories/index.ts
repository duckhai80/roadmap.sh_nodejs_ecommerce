import { formatSelectData, formatUnselectData } from "@/utils";
import { Model, QueryFilter } from "mongoose";

export * from "./inventory.repo";
export * from "./product.repo";

export const findAll = async <T>({
  model,
  filter,
  limit,
  page,
  sort,
  select,
  unselect,
}: {
  model: Model<T>;
  filter: QueryFilter<T>;
  limit: number;
  page: number;
  sort: string;
  select?: string[];
  unselect?: string[];
}) => {
  const skip = (page - 1) * limit;
  const sortBy: { [key: string]: 1 | -1 } =
    sort === "ctime" ? { _id: -1 } : { _id: 1 };

  let query = model.find(filter).limit(limit).skip(skip).sort(sortBy);

  if (select) {
    query = query.select(formatSelectData());
  }

  if (unselect) {
    query = query.select(formatUnselectData());
  }

  return await query.lean();
};
