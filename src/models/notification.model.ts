import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "notifications";

// Declare the Schema of the Mongo model
const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["ORDER_001", "ORDER_002", "PROMOTION_001", "SHOP_001", "SHOP_002"],
      required: true,
    },
    senderId: { type: Schema.Types.ObjectId, required: true, ref: "Shop" },
    // receiverId: { type: Schema.Types.ObjectId, required: true },
    receiverId: { type: String, required: true },
    content: { type: String, default: "" },
    options: { type: Object, default: {} },
  },
  { collection: COLLECTION_NAME, timestamps: true },
);

export type Notification = InferSchemaType<typeof notificationSchema> & {
  _id: Types.ObjectId;
};

//Export the model
export default mongoose.model(DOCUMENT_NAME, notificationSchema);
