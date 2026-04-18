const express = require("express");
const Controller = require("../Controllers/subCategoryControllers");
const Validators = require("../utils/validators/subCategoryValidators");
// mergeParams allows us to access the params from the parent router (categoryId) in this subcategory router
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(Controller.getAllSubCategories)
  .post(
    Controller.setCategoryIdToBody,
    Validators.createSubCategoryValidation,
    Controller.createSubCategory,
  );

router
  .route("/:id")
  .get(Validators.getSubCategoryValidation, Controller.getSubCategoryById)
  .put(Validators.updateSubCategoryValidation, Controller.updateSubCategory)
  .delete(Validators.deleteSubCategoryValidation, Controller.deleteSubCategory);

module.exports = router;
