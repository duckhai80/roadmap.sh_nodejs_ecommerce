import mongoose, { InferSchemaType } from "mongoose";

const DOCUMENT_NAME = "Clothing";
const COLLECTION_NAME = "clothings";

const clothingSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    // product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export type Clothing = InferSchemaType<typeof clothingSchema>;

export default mongoose.model(DOCUMENT_NAME, clothingSchema);
