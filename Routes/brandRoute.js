const express = require("express");
const router = express.Router();
const Controller = require("../controllers/brandController");
const Validators = require("../utils/validators/brandValidators");
const AuthController = require("../controllers/authController");
router
  .route("/")
  .get(Controller.getBrands)
  .post(
    AuthController.protect, 
    AuthController.allowedTo("admin", "manager"),
    Controller.uploadBrandImage,
    Controller.resizeImage,
    Validators.createBrandValidation,
    Controller.createBrand,
  );

router
  .route("/:id")
  .get(Validators.getBrandValidation, Controller.getBrand)
  .put(
    AuthController.protect,
    AuthController.allowedTo("admin", "manager"),
    Controller.uploadBrandImage,
    Controller.resizeImage,
    Validators.updateBrandValidation,
    Controller.updateBrand,
  )
  .delete(
    AuthController.protect,
    AuthController.allowedTo("admin"),
    Validators.deleteBrandValidation,
    Controller.deleteBrand
  );

module.exports = router;
