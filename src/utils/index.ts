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

export * from "./auth.util";
