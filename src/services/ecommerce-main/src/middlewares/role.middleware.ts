import { AccessControl } from "accesscontrol";

// grant list fetched from DB (to be converted to a valid grants object, internally)
let grantList = [
  // Role admin
  {
    role: "admin",
    resource: "profile",
    action: "read:any",
    attributes: "*, !views",
  },
  {
    role: "admin",
    resource: "profile",
    action: "update:any",
    attributes: "*, !views",
  },
  {
    role: "admin",
    resource: "profile",
    action: "delete:any",
    attributes: "*, !views",
  },
  // Role shop
  {
    role: "shop",
    resource: "profile",
    action: "read:own",
    attributes: "*",
  },
  // Role user
  {
    role: "user",
    resource: "profile",
    action: "read:own",
    attributes: "*",
  },
];

export const accessControllerMiddleware = new AccessControl(grantList);
