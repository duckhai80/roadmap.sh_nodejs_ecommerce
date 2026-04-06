import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Furniture";
const COLLECTION_NAME = "furnitures";

const furnitureSchema = new mongoose.Schema(
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

export type Furniture = InferSchemaType<typeof furnitureSchema> & {
  _id: Types.ObjectId;
};

export default mongoose.model(DOCUMENT_NAME, furnitureSchema);
