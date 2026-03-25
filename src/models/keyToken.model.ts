import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = "KeyToken";
const COLLECTION_NAME = "keytokens";

const keyTokenSchema = new mongoose.Schema(
  {
    shop: {
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

export default mongoose.model(DOCUMENT_NAME, keyTokenSchema);
