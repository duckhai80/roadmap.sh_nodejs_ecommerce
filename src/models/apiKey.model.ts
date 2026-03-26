import mongoose, { InferSchemaType } from "mongoose";

const DOCUMENT_NAME = "ApiKey";
const COLLECTION_NAME = "apikeys";

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export type ApiKey = InferSchemaType<typeof apiKeySchema>;

export default mongoose.model(DOCUMENT_NAME, apiKeySchema);
