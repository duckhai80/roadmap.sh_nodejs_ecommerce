import _ from "lodash";

export const getInfoData = ({
  object = {},
  fields = [],
}: {
  object: {};
  fields: string[];
}) => {
  return _.pick(object, fields);
};

export const formatSelectData = (selectArray: string[] = []) => {
  return Object.fromEntries(selectArray.map((selectItem) => [selectItem, 1]));
};

export const formatUnselectData = (unselectArray: string[] = []) => {
  return Object.fromEntries(
    unselectArray.map((unselectItem) => [unselectItem, 0]),
  );
};

export * from "./auth.util";
