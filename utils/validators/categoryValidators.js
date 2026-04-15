const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid category ID format"),
  validatorMiddleware,
];

exports.createCategoryValidation = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters long")
    .isLength({ max: 32 })
    .withMessage("Category name must be less than 32 characters long"),
  validatorMiddleware,
];

exports.updateCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid category ID format"),
  validatorMiddleware,
];

exports.deleteCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid category ID format"),
  validatorMiddleware,
];
