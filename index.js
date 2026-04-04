import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import cloudinary from 'cloudinary';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

// CORS
const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Multer setup (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

// ✅ Clean upload route – streams buffer directly to Cloudinary
app.post("/api/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { resource_type: "auto", folder: "products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.status(200).json({
      message: "Image uploaded successfully",
      file: {
        cloudinaryUrl: result.secure_url,
        cloudinaryId: result.public_id,
      },
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Health check
app.get("/", (req, res) => res.json({ message: "Server is running" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));