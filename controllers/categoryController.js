const Category = require("../models/categorySchema");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

// @desc Get all categories
// @route GET /categories
// @access Public
exports.getAllCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const categories = await Category.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});
// @desc Get category by id
// @route GET /categories/:id
// @access Public
exports.getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new ApiError("Category not found", 404));
  }
  res.status(200).json(category);
});
// @desc Create new category
// @route POST /categories
// @access Private
exports.createCategory = asyncHandler(async (req, res) => {
  const newCategory = new Category({
    ...req.body,
    slug: slugify(req.body.name),
  });
  const savedCategory = await newCategory.save();
  res.status(201).json(savedCategory);
});
// @desc Update category
// @route PUT /categories/:id
// @access Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { ...req.body, slug: slugify(req.body.name) },
    {
      new: true,
    },
  );
  if (!category) {
    return next(new ApiError("Category not found", 404));
  }
  res.status(200).json(category);
});
// @desc Delete category
// @route DELETE /categories/:id
// @access Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new ApiError("Category not found", 404));
  }
  res.status(200).json({ message: "Category deleted successfully" });
});
