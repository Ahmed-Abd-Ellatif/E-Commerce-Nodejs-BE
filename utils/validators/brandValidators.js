const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
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
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.updateBrandValidation = [
  check("id").isMongoId().withMessage("Invalid brand ID format"),
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteBrandValidation = [
  check("id").isMongoId().withMessage("Invalid brand ID format"),
  validatorMiddleware,
];
