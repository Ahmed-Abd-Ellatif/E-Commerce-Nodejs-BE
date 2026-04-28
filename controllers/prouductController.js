const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const Product = require("../models/productSchema");
const factory = require("./handlerFactory");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.uploadProductImage = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 6 },
]);

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();
  // 1) Cover image
  const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/products/${imageCoverFilename}`);
  req.body.imageCover = imageCoverFilename;
  // 2) Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, index) => {
      const filename = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${filename}`);
      req.body.images.push(filename);
    }),
  );
  next();
});
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
