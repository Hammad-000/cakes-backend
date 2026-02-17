import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();


const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/best")
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);


app.get("/", (req, res) => res.send("Server running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));