const Product = require("../models/productSchema");
const factory = require("./handlerFactory");
// @desc Get all products
// @route GET /products
// @access Public
exports.getProducts = factory.getAll(Product, "Product");

// @desc Get product by id
// @route GET /products/:id
// @access Public
exports.getProduct = factory.getOne(Product);

// @desc Create new product
// @route POST /products
// @access Private
exports.createProduct = factory.createOne(Product);

// @desc Update product
// @route PUT /products/:id
// @access Private
exports.updateProduct = factory.updateOne(Product);

// @desc Delete product
// @route DELETE /products/:id
// @access Private
exports.deleteProduct = factory.deleteOne(Product);
