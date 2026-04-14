const mongoose = require("mongoose");
// * Create Schema
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minlength: [3, "Category name must be at least 3 characters"],
      maxlength: [32, "Category name must be less than 32 characters"],
    },
    // A and B => a-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }, // * Add createdAt and updatedAt fields
);
// * Create Model & Export
module.exports = mongoose.model("Category", schema);
