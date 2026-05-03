const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userScema");
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// * Upload single image
exports.uploadUserImage = uploadSingleImage("profileImage");
// * Resize image using Sharp
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${filename}`);
  // save image into DB
  req.body.profileImage = filename;
  next();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// @desc Get all users
// @route GET /users
// @access Private
exports.getUsers = factory.getAll(User);

// @desc Get user by id
// @route GET /users/:id
// @access Private
exports.getUser = factory.getOne(User);

// @desc Create new user
// @route POST /users
// @access Private
exports.createUser = factory.createOne(User);

// @desc Update user
// @route PUT /users/:id
// @access Private
// exports.updateUser = factory.updateOne(User);
exports.updateUser = asyncHandler(async (req, res) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      new: true,
    },
  );
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );
  res.status(200).json({ data: document });
});

// @desc Delete user
// @route DELETE /users/:id
// @access Private
exports.deleteUser = factory.deleteOne(User);
