import { OrderStatus } from "@/types";
import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "orders";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    checkout: { type: Object, default: {} },
    /* 
      {
        totalOrder,
        totalDiscount,
        totalPayment,
        feeShip
      }
    */

    shipping: { type: Object, default: {} },
    /* 
      {
        street,
        city,
        status,
        country
      } 
    */

    payment: { type: Object, default: {} },
    products: { type: Array, default: [] },
    // resolvedShopCheckouts

    trackingNumber: { type: String, default: "#0000110042026" },
    status: { type: String, enum: OrderStatus, default: OrderStatus.PENDING },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

export type Order = InferSchemaType<typeof orderSchema> & {
  _id: Types.ObjectId;
};

export default mongoose.model(DOCUMENT_NAME, orderSchema);
