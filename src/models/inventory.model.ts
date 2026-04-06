import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "inventories";

// Declare the Schema of the Mongo model
const inventorySchema = new mongoose.Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    stock: { type: Number, required: true },
    location: { type: String, default: "unknown" },
    reservations: { type: Array, default: [] },
    /* 
      cartId
      stock
      createdOn
    */
  },
  { collection: COLLECTION_NAME, timestamps: true },
);

export type Inventory = InferSchemaType<typeof inventorySchema> & {
  _id: Types.ObjectId;
};

//Export the model
export default mongoose.model(DOCUMENT_NAME, inventorySchema);
