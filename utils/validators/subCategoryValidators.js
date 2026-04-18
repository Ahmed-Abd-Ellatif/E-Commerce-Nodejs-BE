const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getSubCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid subCategory ID format"),
  validatorMiddleware,
];

exports.createSubCategoryValidation = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name is required")
    .isLength({ min: 2 })
    .withMessage("SubCategory name must be at least 2 characters long")
    .isLength({ max: 32 })
    .withMessage("SubCategory name must be less than 32 characters long"),
  check("category")
    .notEmpty()
    .withMessage("Parent category ID is required")
    .isMongoId()
    .withMessage("Invalid category ID format"),
  validatorMiddleware,
];

exports.updateSubCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid subCategory ID format"),
  validatorMiddleware,
];

exports.deleteSubCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid subCategory ID format"),
  validatorMiddleware,
];
