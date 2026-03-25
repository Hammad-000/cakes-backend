import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import cloudinary from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';
import File from './models/file.js'; // File model for saving image info

dotenv.config();

// Initialize Express App
const app = express();
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", 
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Multer Setup for Image Upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  }
});

// Image Upload Route
app.post("/api/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Upload image to Cloudinary
    const cloudinaryResponse = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Save image info to the database
    const newFile = new File({
      originalName: req.file.originalname,
      cloudinaryUrl: cloudinaryResponse.secure_url,
      cloudinaryId: cloudinaryResponse.public_id,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });

    await newFile.save();

    res.status(200).json({
      message: "Image uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// API Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Root Route for Server Check
app.get("/", (req, res) => res.json({ message: "Server is running" }));

// Server Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});