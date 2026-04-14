const express = require("express");
const router = express.Router();
const controller = require("../controllers/categoryController");

router
  .route("/")
  .get(controller.getAllCategories)
  .post(controller.createCategory);

router
  .route("/:id")
  .get(controller.getCategoryById)
  .put(controller.updateCategory)
  .delete(controller.deleteCategory);

module.exports = router;
