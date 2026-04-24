const Category = require("../models/categorySchema");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// @desc Get all categories
// @route GET /categories
// @access Public
exports.getAllCategories = asyncHandler(async (req, res) => {
  // 1. Build query
  const apiFeatures = new ApiFeatures(Category.find(), req.query)
    .paginate(await Category.countDocuments())
    .filter()
    .sort()
    .limitFields()
    .search();
  // 2. Execute query

  const {mongooseQuery , paginationResult} = apiFeatures;
  const categories = await mongooseQuery;
  res.status(200).json({ results: categories.length, paginationResult, data: categories });
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
