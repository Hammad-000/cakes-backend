import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import jwt from "jsonwebtoken";

const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "24h" }
);

/* ===============================
    CREATE ORDER (User Only)
=============================== */
export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "Order must have at least one item" });
    }

    // Calculate total price
    let totalPrice = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      totalPrice += product.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalPrice,
      status: "pending",
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
    GET USER ORDERS (User Only)
=============================== */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.product");
    res.status(200).json({
      message: "User orders fetched successfully",
      orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
    GET ALL ORDERS (Admin Only)
=============================== */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("items.product");
    res.status(200).json({
      message: "All orders fetched successfully",
      orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user").populate("items.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};