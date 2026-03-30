import { PRODUCT_TYPE } from "@/constants";
import mongoose, { InferSchemaType, Schema } from "mongoose";
import slugify from "slugify";

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "products";

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String, required: true },
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: [
        PRODUCT_TYPE.ELECTRONICS,
        PRODUCT_TYPE.CLOTHING,
        PRODUCT_TYPE.FURNITURE,
      ],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be higher than 1.0"],
      max: [5, "Rating must be less than 5.0"],
      set: (val: number) => Math.round(val * 10) / 10,
    },

    product_variations: {
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
productSchema.index({ product_name: "text", product_description: "text" });

productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
});

export type Product = InferSchemaType<typeof productSchema>;

export default mongoose.model(DOCUMENT_NAME, productSchema);
