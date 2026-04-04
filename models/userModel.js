import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true, // remove extra spaces
      match: [/\S+@\S+\.\S+/, "Invalid email format"], // simple email validation
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"], // only allow these two roles
      default: "user",
    },
  },
  { timestamps: true }
);

// Ensure indexes are created for unique constraints
// userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);