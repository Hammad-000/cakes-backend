import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"], 
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"], 
      default: "user",
    },
  },
  { timestamps: true }
);

// Ensure indexes are created for unique constraints
// userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);