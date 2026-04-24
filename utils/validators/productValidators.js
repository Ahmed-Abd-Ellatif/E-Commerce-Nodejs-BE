const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categorySchema");
const Subcategory = require("../../models/subCategorySchema");

exports.getProductValidation = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];

exports.createProductValidation = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 2 })
    .withMessage("Product title must be at least 2 characters long")
    .isLength({ max: 100 })
    .withMessage("Product title must be less than 100 characters long"),
  body("title").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20 })
    .withMessage("Product description must be at least 20 characters long"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product price after discount must be a number")
    .isFloat()
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error("Product price after discount must be less than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Product colors must be an array"),

  check("imageCover")
    .notEmpty()
    .withMessage("Product cover image is required")
    .isURL()
    .withMessage("Product cover image must be a valid URL"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images must be an array of URLs"),
  check("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error("Category not found");
      }
      return true;
    }),
  check("subcategories")
    .optional()
    .isArray()
    .withMessage("Product subcategories must be an array of IDs")
    .custom(async (subcategoriesIds, { req }) => {
      if (!Array.isArray(subcategoriesIds) || subcategoriesIds.length === 0) {
        return true;
      }
      const uniqueSubIds = [...new Set(subcategoriesIds)];
      const categoryId = req.body.category;
      const foundSubcategories = await Subcategory.find({
        _id: { $in: uniqueSubIds },
        category: categoryId,
      });
      if (foundSubcategories.length !== uniqueSubIds.length) {
        throw new Error(
          "Invalid subcategories: one or more IDs not found or don't belong to the selected category",
        );
      }
      return true;
    }),

  check("brand").optional().isMongoId().withMessage("Invalid brand ID format"),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product ratings average must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Product ratings average must be between 1 and 5")
    .isLength({ min: 1 })
    .withMessage("Product ratings average must be at least 1")
    .isLength({ max: 5 })
    .withMessage("Product ratings average must be less than 5"),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratings quantity must be a number"),

  validatorMiddleware,
];

exports.updateProductValidation = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  body("title").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteProductValidation = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];
