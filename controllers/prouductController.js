const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Product = require("../models/productSchema");

// @desc Get all products
// @route GET /products
// @access Public
exports.getProducts = asyncHandler(async (req, res) => {
  // 1. clone req.query and remove fields that are not used for filtering
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields", "keyword"];
  excludeFields.forEach((field) => delete queryObj[field]);

  // Advanced filtering (gt, gte, lt, lte)
  let finalQueryObj = JSON.stringify(queryObj);
  finalQueryObj = finalQueryObj.replace(
    /\b(gt|gte|lt|lte)\b/g,
    (match) => `$${match}`,
  );
  finalQueryObj = JSON.parse(finalQueryObj);

  // 2. Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  // 3. Build query
  const mongooseQuery = Product.find(finalQueryObj)
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name" });

  // 4. Sorting
  // ASC => sort("price") 0:5 || DESC => sort("-price") 5:0
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery.sort(sortBy);
  } else {
    // newest to oldest
    mongooseQuery.sort("-createdAt");
  }
  // 5. Field Limiting
  // ?fields=title,price => select("title price") i need return it
  // ?fields=-title,-price => select("-title -price") i don't need return it
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    mongooseQuery.select(fields);
  } else {
    mongooseQuery.select("-__v ");
  }
  // 6. Search
  if (req.query.keyword) {
    const keyword = req.query.keyword;
    mongooseQuery.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } }, // i => case insensitive
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
  }

  // 7. Execute query
  const products = await mongooseQuery;
  res.status(200).json({ results: products.length, page, data: products });
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
