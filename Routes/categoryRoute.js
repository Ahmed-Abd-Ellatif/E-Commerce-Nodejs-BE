const express = require("express");
const Controller = require("../controllers/categoryController");
const Validators = require("../utils/validators/categoryValidators");
const subcategoriesRouter = require("./subcategoryRoute");
const AuthController = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(AuthController.protect,Controller.getAllCategories)  
  .post(
    AuthController.protect, //Authentication
    AuthController.allowedTo("admin", "manager"), //Authorization
    Controller.uploadCategoryImage,
    Controller.resizeImage,
    Validators.createCategoryValidation,
    Controller.createCategory,
  );

router
  .route("/:id")
  .get(Validators.getCategoryValidation, Controller.getCategoryById)
  .put(
    AuthController.protect,
    AuthController.allowedTo("admin", "manager"),
    Controller.uploadCategoryImage,
    Controller.resizeImage,
    Validators.updateCategoryValidation,
    Controller.updateCategory,
  )
  .delete(
    AuthController.protect,
    AuthController.allowedTo("admin"),
    Validators.deleteCategoryValidation,
    Controller.deleteCategory
  );

router.use("/:categoryId/subcategories", subcategoriesRouter);

module.exports = router;
