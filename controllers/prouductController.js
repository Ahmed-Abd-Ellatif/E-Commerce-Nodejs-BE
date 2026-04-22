const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Product = require("../models/productSchema");
const ApiFeatures = require("../utils/apiFeatures");

// @desc Get all products
// @route GET /products
// @access Public
exports.getProducts = asyncHandler(async (req, res) => {
  // 1. Build query
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .search()
    .paginate();

  // 2. Execute query
  const products = await apiFeatures.mongooseQuery;
  res.status(200).json({ results: products.length, data: products });
});
// @desc Get product by id
// @route GET /products/:id
// @access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: "category",
    select: "name",
  });
  if (!product) {
    return next(
      new ApiError(`Product not found with id ${req.params.id}`, 404),
    );
  }
  res.status(200).json({ data: product });
});
// @desc Create new product
// @route POST /products
// @access Private
exports.createProduct = asyncHandler(async (req, res) => {
  const newProduct = new Product({
    ...req.body,
    slug: slugify(req.body.title),
  });
  const savedProduct = await newProduct.save();
  res.status(201).json(savedProduct);
});
// @desc Update product
// @route PUT /products/:id
// @access Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product) {
    return next(
      new ApiError(`Product not found with id ${req.params.id}`, 404),
    );
  }
  res.status(200).json({ data: product });
});
// @desc Delete product
// @route DELETE /products/:id
// @access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(
      new ApiError(`Product not found with id ${req.params.id}`, 404),
    );
  }
  res.status(204).json({ data: null });
});
