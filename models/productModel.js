import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {     
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
    originalPrice: {   
      type: Number,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: {     
      type: String,
      required: true,
    },
    rating: {         
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {         
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