const SubCategory = require("../models/subCategorySchema");
const factory = require("./handlerFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// @desc Get all SubCategories
// @route GET / subcategories
// @access Public
exports.getAllSubCategories = factory.getAll(SubCategory);

// @desc Get SubCategory by id
// @route GET / subcategories/:id
// @access Public
exports.getSubCategoryById = factory.getOne(SubCategory);

// @desc Create new SubCategory
// @route POST / subcategories
// @access Private
exports.createSubCategory = factory.createOne(SubCategory);

// @desc Update SubCategory
// @route PUT / subcategories/:id
// @access Private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc Delete SubCategory
// @route DELETE / subcategories/:id
// @access Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
