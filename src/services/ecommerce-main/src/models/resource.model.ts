import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Resource";
const COLLECTION_NAME = "resources";

// Declare the Schema of the Mongo model
const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { collection: COLLECTION_NAME, timestamps: true },
);

export type Resource = InferSchemaType<typeof resourceSchema> & {
  _id: Types.ObjectId;
};

//Export the model
export default mongoose.model(DOCUMENT_NAME, resourceSchema);
