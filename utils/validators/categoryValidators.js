const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
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
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.updateCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid category ID format"),
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid category ID format"),
  validatorMiddleware,
];
