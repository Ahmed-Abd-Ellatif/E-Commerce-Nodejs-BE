const Brand = require("../models/brandSchema");
const factory = require("./handlerFactory");

// @desc Get all brands
// @route GET /brands
// @access Public
exports.getBrands = factory.getAll(Brand);

// @desc Get brand by id
// @route GET /brands/:id
// @access Public
exports.getBrand = factory.getOne(Brand);

// @desc Create new brand
// @route POST /brands
// @access Private
exports.createBrand = factory.createOne(Brand);

// @desc Update brand
// @route PUT /brands/:id
// @access Private
exports.updateBrand = factory.updateOne(Brand);

// @desc Delete brand
// @route DELETE /brands/:id
// @access Private
exports.deleteBrand = factory.deleteOne(Brand);
