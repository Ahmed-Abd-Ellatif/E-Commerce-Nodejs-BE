const { check, body } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userScema");
exports.getUserValidation = [
  check("id").isMongoId().withMessage("Invalid user ID format"),
  validatorMiddleware,
];

exports.createUserValidation = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("User name must be at least 2 characters long"),
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already in use");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  check("profileImage")
    .optional()
    .isString()
    .withMessage("Profile image must be a string"),
  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number")
    .custom(async (value) => {
      const user = await User.findOne({ phone: value });
      if (user) {
        throw new Error("Phone number already in use");
      }
      return true;
    }),
  validatorMiddleware,
];
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// * USER CHANGE PASSWORD VALIDATION
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.changeUserPasswordValidation = [
  check("id").isMongoId().withMessage("Invalid user ID format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .isLength({ min: 6 })
    .withMessage("Current password must be at least 6 characters long"),
  check("password")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
  check("confirmNewPassword")
    .notEmpty()
    .withMessage("Confirm new password is required")
    .custom(async (value, { req }) => {
      // 1- verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User not found");
      }
      if (!bcrypt.compareSync(req.body.currentPassword, user.password)) {
        throw new Error("Current password is incorrect");
      }
      // 2- verify password confirmation
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateUserValidation = [
  check("id").isMongoId().withMessage("Invalid user ID format"),
  body("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already in use");
      }
      return true;
    }),
  check("profileImage")
    .optional()
    .isString()
    .withMessage("Profile image must be a string"),
  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number")
    .custom(async (value) => {
      const user = await User.findOne({ phone: value });
      if (user) {
        throw new Error("Phone number already in use");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidation = [
  check("id").isMongoId().withMessage("Invalid user ID format"),
  validatorMiddleware,
];
