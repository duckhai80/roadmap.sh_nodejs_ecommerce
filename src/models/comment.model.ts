import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "comments";

// Declare the Schema of the Mongo model
const commentSchema = new mongoose.Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    userId: { type: String, default: 1 },
    content: { type: String, required: true },
    left: { type: Number, default: 0 },
    right: { type: Number, default: 0 },
    parentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: { type: Boolean, default: false },
  },
  { collection: COLLECTION_NAME, timestamps: true },
);

export type Comment = InferSchemaType<typeof commentSchema> & {
  _id: Types.ObjectId;
};

//Export the model
export default mongoose.model(DOCUMENT_NAME, commentSchema);
