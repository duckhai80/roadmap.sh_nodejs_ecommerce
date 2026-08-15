import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    slug: { type: String, required: true },
    name: { type: String, default: "" },
    password: { type: String, default: "", required: true },
    salf: { type: String, default: "" },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    sex: { type: String, default: "" },
    avatar: { type: String, default: "" },
    dateOfBirth: { type: Date, default: null },
    role: { type: Schema.Types.ObjectId, ref: "Role" },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "blocked"],
    },
  },
  { collection: COLLECTION_NAME, timestamps: true },
);

export type User = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};

//Export the model
export default mongoose.model(DOCUMENT_NAME, userSchema);
