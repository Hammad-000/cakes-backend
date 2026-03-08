import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import mongoose from "mongoose";


dotenv.config(); 

const app = express();
app.use(express.json());  

const allowedOrigins = [
  "http://localhost:3000", // Local development
  process.env.FRONTEND_URL // Production URL (e.g., Vercel, Netlify)
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));

// MongoDB setup
const DB_URL = process.env.MONGO_URI;  
const client = new MongoClient(DB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);  
  }
}

run();

// Routes
app.use("/api/auth", authRoutes);  
app.use("/api/products", productRoutes);  

// Health check route to confirm server is running
app.get("/", (req, res) => res.json({ message: "Server is running" }));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//-----------------------------------------

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });