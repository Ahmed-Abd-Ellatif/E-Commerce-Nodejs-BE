const mongoose = require("mongoose");
// * Create Schema
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minlength: [2, "Category name must be at least 2 characters"],
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
// FindOne , FindAll , Update
schema.post("init", (doc) => {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}/categories/${doc.image}`;
  }
});
// Create
schema.post("save", (doc) => {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}/categories/${doc.image}`;
  }
});
// * Create Model & Export
module.exports = mongoose.model("Category", schema);
