import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Electronics";
const COLLECTION_NAME = "electronics";

const electronicsSchema = new mongoose.Schema(
  {
    manufactory: { type: String, required: true },
    model: String,
    color: String,
    shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export type Electronics = InferSchemaType<typeof electronicsSchema> & {
  _id: Types.ObjectId;
};

export default mongoose.model(DOCUMENT_NAME, electronicsSchema);
