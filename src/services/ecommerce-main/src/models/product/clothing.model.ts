import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Clothing";
const COLLECTION_NAME = "clothings";

const clothingSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export type Clothing = InferSchemaType<typeof clothingSchema> & {
  _id: Types.ObjectId;
};

export default mongoose.model(DOCUMENT_NAME, clothingSchema);
