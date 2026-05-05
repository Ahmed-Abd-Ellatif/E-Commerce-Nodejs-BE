const express = require("express");
const Controller = require("../Controllers/subCategoryControllers");
const Validators = require("../utils/validators/subCategoryValidators");
// mergeParams allows us to access the params from the parent router (categoryId) in this subcategory router
const router = express.Router({ mergeParams: true });
const AuthController = require("../controllers/authController");

router
  .route("/")
  .get(Controller.getAllSubCategories)
  .post(
    AuthController.protect,
    AuthController.allowedTo("admin", "manager"),
    Controller.setCategoryIdToBody,
    Validators.createSubCategoryValidation,
    Controller.createSubCategory,
  );

router
  .route("/:id")
  .get(Validators.getSubCategoryValidation, Controller.getSubCategoryById)
  .put(
    AuthController.protect,
    AuthController.allowedTo("admin", "manager"),
    Validators.updateSubCategoryValidation,
    Controller.updateSubCategory
  )
  .delete(
    AuthController.protect,
    AuthController.allowedTo("admin"),
    Validators.deleteSubCategoryValidation,
    Controller.deleteSubCategory
  );

module.exports = router;
