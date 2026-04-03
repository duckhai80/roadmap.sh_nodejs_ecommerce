import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "KeyStore";
const COLLECTION_NAME = "keystores";

const keyStoreSchema = new mongoose.Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    privateKey: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    // Array of refresh tokens that have bene used
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

export type KeyStore = InferSchemaType<typeof keyStoreSchema> & {
  _id: Types.ObjectId;
};

export default mongoose.model(DOCUMENT_NAME, keyStoreSchema);
