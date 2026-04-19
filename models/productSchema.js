const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minlength: [2, "Product title must be at least 2 characters"],
      maxlength: [100, "Product title must be less than 100 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [2000, "Product description must be at least 2000 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    images: [String],
    imageCover: {
      type: String,
      required: [true, "Product cover image is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    subcategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", schema);
