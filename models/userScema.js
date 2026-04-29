const mongoose = require("mongoose");
// * Create Schema
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "email is required"],
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
    },
    profileImage: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlenght: [6, "password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", schema);
