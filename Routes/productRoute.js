const express = require("express");
const router = express.Router();
const Controller = require("../controllers/prouductController");
const Validators = require("../utils/validators/productValidators");

router
  .route("/")
  .get(Controller.getProducts)
  .post(
    Controller.uploadProductImage,
    Controller.resizeImage,
    Validators.createProductValidation,
    Controller.createProduct,
  );

router
  .route("/:id")
  .get(Validators.getProductValidation, Controller.getProduct)
  .put(
    Controller.uploadProductImage,
    Controller.resizeImage,
    Validators.updateProductValidation,
    Controller.updateProduct,
  )
  .delete(Validators.deleteProductValidation, Controller.deleteProduct);

module.exports = router;
