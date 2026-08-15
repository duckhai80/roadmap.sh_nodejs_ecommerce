import { RoleType } from "@/types";
import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "roles";

// Declare the Schema of the Mongo model
const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: RoleType.USER,
      enum: Object.values(RoleType),
    },
    slug: { type: String, required: true },
    status: {
      type: String,
      default: "active",
      enum: ["pending", "active", "block"],
    },
    description: { type: String, default: "" },
    grants: [
      {
        resourceId: {
          type: Schema.Types.ObjectId,
          ref: "Resource",
          required: true,
        },
        actions: [{ type: String, required: true }],
        attributes: { type: String, default: "*" },
      },
    ],
  },
  { collection: COLLECTION_NAME, timestamps: true },
);

export type Role = InferSchemaType<typeof roleSchema> & {
  _id: Types.ObjectId;
};

export type RoleGrant = {
  resources: Types.ObjectId;
  actions: string[];
  attributes: string;
};

// Plain input shape: `grants` on `Role` is a mongoose DocumentArray, which a
// caller cannot build from a literal.
export type RoleInput = Omit<Role, "grants"> & {
  grants: RoleGrant[];
};

//Export the model
export default mongoose.model(DOCUMENT_NAME, roleSchema);

// Demo grand list
const grandList = [
  // Admin
  { resource: "profile", actions: ["update:any"], attributes: "*" },
  { resource: "balance", actions: ["update:any"], attributes: "*, !amount" },

  // Shop
  { resource: "profile", actions: ["update:own"], attributes: "*" },
  { resource: "balance", actions: ["update:own"], attributes: "*, !amount" },

  // User
  { resource: "profile", actions: ["update:own"], attributes: "*" },
  { resource: "balance", actions: ["read:own"], attributes: "*" },
];
