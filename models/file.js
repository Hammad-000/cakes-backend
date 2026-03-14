import mongoose from "mongoose";

// Define the schema for storing image metadata
const fileSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }  // This will automatically add createdAt and updatedAt fields
);

// Create and export the model
const File = mongoose.model("File", fileSchema);

export default File;
