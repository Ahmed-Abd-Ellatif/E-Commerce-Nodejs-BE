const express = require("express");
const router = express.Router();
const Controller = require("../controllers/categoryController");
const Validators = require("../utils/validators/categoryValidators");

router
  .route("/")
  .get(Controller.getAllCategories)
  .post(Validators.createCategoryValidation, Controller.createCategory);

router
  .route("/:id")
  .get(Validators.getCategoryValidation, Controller.getCategoryById)
  .put(Validators.updateCategoryValidation, Controller.updateCategory)
  .delete(Validators.deleteCategoryValidation, Controller.deleteCategory);

module.exports = router;
