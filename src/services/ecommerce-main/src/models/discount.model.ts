import mongoose, { InferSchemaType, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

export enum ApplyTo {
  ALL = "all",
  SPECIFIC = "specific",
}

export enum DiscountType {
  FIXED_AMOUNT = "fixedAmount",
  PERCENTAGE = "percentage",
}

// Declare the Schema of the Mongo model
const discountSchema = new mongoose.Schema(
  {
    shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    name: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: DiscountType,
      required: true,
      default: DiscountType.FIXED_AMOUNT,
    }, // or percentage
    value: { type: Number, required: true }, // 100000 or 10%
    code: { type: String, required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    maxUses: { type: Number, required: true }, // total uses
    maxUsesPerUser: { type: Number, required: true }, // max uses per user
    minOrderValue: { type: Number, required: true },
    usesCount: { type: Number, required: true }, // current uses
    usersUsed: { type: Array, default: [] }, // users who used

    isActive: { type: Boolean, default: true },
    appliesTo: { type: String, required: true, enum: ApplyTo },
    appliesToProduct: { type: [String], default: [] },
  },
  { collection: COLLECTION_NAME, timestamps: true },
);

export type Discount = InferSchemaType<typeof discountSchema> & {
  _id: Types.ObjectId;
};

//Export the model
export default mongoose.model(DOCUMENT_NAME, discountSchema);
