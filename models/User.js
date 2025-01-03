import mongoose from "mongoose";

// Main User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true, minimize: false }
);

const User = mongoose.model("User", userSchema);

export default User;
