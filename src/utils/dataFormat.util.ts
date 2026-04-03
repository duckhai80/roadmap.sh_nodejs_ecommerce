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

export const removeUndefinedNullObject = (obj: any) => {
  const result: any = {};

  Object.keys(obj).forEach((k) => {
    const current = obj[k];

    if ([null, undefined].includes(current)) return;
    if (Array.isArray(current)) return;

    if (typeof current === "object") {
      result[k] = removeUndefinedNullObject(current);

      return;
    }

    result[k] = current;
  });

  return result;
};

export const updateNestedObjectPatch = (obj: any) => {
  const finalObject: any = {};

  Object.keys(obj).forEach((key) => {
    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      const finalNestedObject = updateNestedObjectPatch(obj[key]);

      Object.keys(finalNestedObject).forEach((keyChild) => {
        finalObject[`${key}.${keyChild}`] = finalNestedObject[keyChild];
      });
    } else {
      if (obj[key] !== undefined && obj[key] !== null) {
        finalObject[key] = obj[key];
      }
    }
  });

  return finalObject;
};
