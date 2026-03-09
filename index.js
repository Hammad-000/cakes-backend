import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import mongoose from "mongoose";
import multer from "multer";
import cloudinary from 'cloudinary'
import path from "path";
import { fileURLToPath } from "url";



dotenv.config(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());  

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL 
].filter(Boolean);



app.use(cors({ origin: allowedOrigins, credentials: true }));

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
const fileSchema = new mongoose.Schema(
  {
    originalName: String,
    cloudinaryUrl: String,
    cloudinaryId: String,
    fileType: String,
    fileSize: Number
  },
  { timestamps: true }
);



const File = mongoose.model("File", fileSchema);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"), false);
  }
});

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