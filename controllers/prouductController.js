const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Product = require("../models/productSchema");

// @desc Get all products
// @route GET /products
// @access Public
exports.getProducts = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find()
  .populate({ path: "category", select: "name" },{path: "subcategory", select: "name"})
  .skip(skip).limit(limit);
  res.status(200).json({ results: products.length, page, data: products });
});
// @desc Get product by id
// @route GET /products/:id
// @access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({ path: "category", select: "name" });
  if (!product) {
    return next(new ApiError(`Product not found with id ${req.params.id}`, 404));
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

  if(req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.findByIdAndUpdate(req.params.id, 
     req.body , 
    { new: true }
  );
    if (!product) {
    return next(new ApiError(`Product not found with id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: product });
});
// @desc Delete product
// @route DELETE /products/:id
// @access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ApiError(`Product not found with id ${req.params.id}`, 404));
  }
  res.status(204).json({ data: null });
});