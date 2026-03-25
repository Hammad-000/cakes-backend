import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {       // frontend uses product.title
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {   // optional for discounts
      type: Number,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: {          // frontend uses product.image
      type: String,
      required: true,
    },
    rating: {         // frontend StarRating expects rating
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {          // optional for StarRating reviews count
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;