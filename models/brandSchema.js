const mongoose = require("mongoose");
// * Create Schema
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name must be unique"],
      minlength: [2, "Brand name must be at least 2 characters"],
      maxlength: [32, "Brand name must be less than 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);
// * Create Model & Export
module.exports = mongoose.model("Brand", schema);
