const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Brand = require("../models/brandSchema");

// @desc Get all brands
// @route GET /brands
// @access Public
exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const brands = await Brand.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: brands.length, page, data: brands });
});
// @desc Get brand by id
// @route GET /brands/:id
// @access Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    return next(new ApiError("Brand not found", 404));
  }
  res.status(200).json(brand);
});
// @desc Create new brand
// @route POST /brands
// @access Private
exports.createBrand = asyncHandler(async (req, res) => {
  const newBrand = new Brand({
    ...req.body,
    slug: slugify(req.body.name),
  });
  const savedBrand = await newBrand.save();
  res.status(201).json(savedBrand);
});
// @desc Update brand
// @route PUT /brands/:id
// @access Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    { ...req.body, slug: slugify(req.body.name) },
    {
      new: true,
    },
  );
  if (!brand) {
    return next(new ApiError("Brand not found", 404));
  }
  res.status(200).json(brand);
});
// @desc Delete brand
// @route DELETE /brands/:id
// @access Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) {
    return next(new ApiError("Brand not found", 404));
  }
  res.status(200).json({ message: "Brand deleted successfully" });
});
