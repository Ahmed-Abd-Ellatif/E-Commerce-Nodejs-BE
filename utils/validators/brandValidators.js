const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getBrandValidation = [
  check("id").isMongoId().withMessage("Invalid brand ID format"),
  validatorMiddleware,
];

exports.createBrandValidation = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2 })
    .withMessage("Brand name must be at least 2 characters long")
    .isLength({ max: 32 })
    .withMessage("Brand name must be less than 32 characters long"),
  validatorMiddleware,
];

exports.updateBrandValidation = [
  check("id").isMongoId().withMessage("Invalid brand ID format"),
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Brand name must be at least 2 characters long")
    .isLength({ max: 32 })
    .withMessage("Brand name must be less than 32 characters long"),
  validatorMiddleware,
];

exports.deleteBrandValidation = [
  check("id").isMongoId().withMessage("Invalid brand ID format"),
  validatorMiddleware,
];
