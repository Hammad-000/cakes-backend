import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  cloudinaryUrl: { type: String, required: true },
  // cloudinaryId: { type: String, required: true, unique: true }, 
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
}, { timestamps: true });

fileSchema.index({ cloudinaryId: 1 });

export default File;