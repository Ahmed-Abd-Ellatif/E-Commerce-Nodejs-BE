const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Category = require("../models/categorySchema");
const factory = require("./handlerFactory");
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// * Configure Multer Storage
// * DiskStorage
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const filename = `category-${uuidv4()}-${Date.now()}-${file.originalname}`;
//     cb(null, filename);
//   },
// });
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// * MemoryStorage
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const multerStorage = multer.memoryStorage();
// * Configure Multer Filter
const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new ApiError("Not an image! Please upload only images.", 400), false);
  }
};
// * Initialize Multer
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
// * Middleware to handle single image upload
exports.uploadCategoryImage = upload.single("image");
// * Middleware to resize image using Sharp
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);
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
