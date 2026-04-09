import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "carts";

export enum CartStatus {
  ACTIVE = "active",
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: CartStatus,
      default: CartStatus.ACTIVE,
    },
    products: {
      // _id: productId, shopId, quantity, name, price
      type: Array,
      required: true,
      default: [],
    },
    productsCount: {
      type: Number,
      default: 0,
    },
  },
  { collection: COLLECTION_NAME, timestamps: true },
);

export type Cart = InferSchemaType<typeof cartSchema> & {
  _id: Types.ObjectId;
};

//Export the model
export default mongoose.model(DOCUMENT_NAME, cartSchema);
