const express = require("express");
const router = express.Router();
const Controller = require("../controllers/prouductController");
const Validators = require("../utils/validators/productValidators");
const AuthController = require("../controllers/authController");

router
  .route("/")
  .get(Controller.getProducts)
  .post(
    AuthController.protect,
    AuthController.allowedTo("admin", "manager"),
    Controller.uploadProductImage,
    Controller.resizeImage,
    Validators.createProductValidation,
    Controller.createProduct,
  );

router
  .route("/:id")
  .get(Validators.getProductValidation, Controller.getProduct)
  .put(
    AuthController.protect,
    AuthController.allowedTo("admin", "manager"),
    Controller.uploadProductImage,
    Controller.resizeImage,
    Validators.updateProductValidation,
    Controller.updateProduct,
  )
  .delete(
    AuthController.protect,
    AuthController.allowedTo("admin"),
    Validators.deleteProductValidation,
    Controller.deleteProduct
  );

module.exports = router;
