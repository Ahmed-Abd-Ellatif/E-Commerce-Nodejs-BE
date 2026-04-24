const Category = require("../models/categorySchema");
const factory = require("./handlerFactory");

// @desc Get all categories
// @route GET /categories
// @access Public
exports.getAllCategories = factory.getAll(Category);

// @desc Get category by id
// @route GET /categories/:id
// @access Public
exports.getCategoryById = factory.getOne(Category);

// @desc Create new category
// @route POST /categories
// @access Private
exports.createCategory = factory.createOne(Category);

// @desc Update category
// @route PUT /categories/:id
// @access Private
exports.updateCategory = factory.updateOne(Category);

// @desc Delete category
// @route DELETE /categories/:id
// @access Private
exports.deleteCategory = factory.deleteOne(Category);
