const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const Category = require("../models/categorySchema");

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// * Upload single image
exports.uploadCategoryImage = uploadSingleImage("image");
// * Resize image using Sharp
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);
  // save image into DB
  req.body.image = filename;
  next();
});
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
