const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "SubCategory name is required"],
      unique: [true, "SubCategory name must be unique"],
      minlength: [2, "SubCategory name must be at least 2 characters"],
      maxlength: [32, "SubCategory name must be less than 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    //foreign key to category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SubCategory", schema);
