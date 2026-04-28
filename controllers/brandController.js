const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const Brand = require("../models/brandSchema");
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// * Upload single image
exports.uploadBrandImage = uploadSingleImage("image");
// * Resize image using Sharp
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);
  // save image into DB
  req.body.image = filename;
  next();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
