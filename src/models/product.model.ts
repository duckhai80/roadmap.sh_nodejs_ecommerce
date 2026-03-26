import mongoose, { InferSchemaType, Schema } from "mongoose";

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "products";

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export type Product = InferSchemaType<typeof productSchema>;

export default mongoose.model(DOCUMENT_NAME, productSchema);
