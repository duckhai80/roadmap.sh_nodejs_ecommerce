import { QueryFilter } from "mongoose";

export interface QueryParams<T> {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: QueryFilter<T>;
  [key: string]: any;
}
