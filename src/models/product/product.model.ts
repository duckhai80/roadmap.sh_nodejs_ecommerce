import { PRODUCT_TYPE } from "@/constants";
import mongoose, { InferSchemaType, Schema } from "mongoose";
import slugify from "slugify";

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "products";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    thumbnail: { type: String, required: true },
    description: { type: String, required: true },
    slug: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        PRODUCT_TYPE.ELECTRONICS,
        PRODUCT_TYPE.CLOTHING,
        PRODUCT_TYPE.FURNITURE,
      ],
    },
    shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    attributes: { type: Schema.Types.Mixed, required: true },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be higher than 1.0"],
      max: [5, "Rating must be less than 5.0"],
      set: (val: number) => Math.round(val * 10) / 10,
    },

    variations: {
      type: Array,
      default: [],
    },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

// Create index for search products
productSchema.index({ name: "text", description: "text" });

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
});

export type Product = InferSchemaType<typeof productSchema>;

export default mongoose.model(DOCUMENT_NAME, productSchema);
