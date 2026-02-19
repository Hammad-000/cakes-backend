
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number
    }
  ],
  totalPrice: Number,
  status: { type: String, enum: ["pending", "preparing", "delivered"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", OrderSchema);
