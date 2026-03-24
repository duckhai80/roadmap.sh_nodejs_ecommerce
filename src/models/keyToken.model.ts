import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = "KeyToken";
const COLLECTION_NAME = "keytokens";

const keyTokenSchema = new mongoose.Schema(
  {
    user: {
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
    refreshToken: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

export default mongoose.model(DOCUMENT_NAME, keyTokenSchema);
