const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const SubCategory = require("../models/subCategorySchema");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// * Note on populate:
//  .populate("category") return all category data
//  .populate({ path: "category", select: "name" }) return id & name
//  .populate({ path: "category", select: "name -_id"}) return  name only without id
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// @desc Get all SubCategories
// @route GET / subcategories
// @access Public
exports.getAllSubCategories = asyncHandler(async (req, res) => {
  const apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
    .paginate(await SubCategory.countDocuments())
    .filter()
    .sort()
    .limitFields()
    .search();
  const { mongooseQuery, paginationResult } = apiFeatures;
  const subCategories = await mongooseQuery;
  res
    .status(200)
    .json({
      results: subCategories.length,
      paginationResult,
      data: subCategories,
    });
});
// @desc Get SubCategory by id
// @route GET / subcategories/:id
// @access Public
exports.getSubCategoryById = asyncHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findById(req.params.id);
  if (!subCategory) {
    return next(new ApiError("SubCategory not found", 404));
  }
  res.status(200).json(subCategory);
});

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// @desc Create new SubCategory
// @route POST / subcategories
// @access Private
exports.createSubCategory = asyncHandler(async (req, res) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  const newSubCategory = new SubCategory({
    ...req.body,
    slug: slugify(req.body.name),
  });
  const savedSubCategory = await newSubCategory.save();
  res.status(201).json(savedSubCategory);
});
// @desc Update SubCategory
// @route PUT / subcategories/:id
// @access Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findByIdAndUpdate(
    req.params.id,
    { ...req.body, slug: slugify(req.body.name) },
    { new: true },
  );
  if (!subCategory) {
    return next(new ApiError("SubCategory not found", 404));
  }
  res.status(200).json(subCategory);
});
// @desc Delete SubCategory
// @route DELETE / subcategories/:id
// @access Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
  if (!subCategory) {
    return next(new ApiError("SubCategory not found", 404));
  }

  res.status(200).json({ message: "SubCategory deleted successfully" });
});
