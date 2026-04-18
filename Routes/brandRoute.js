const express = require("express");
const router = express.Router();
const Controller = require("../controllers/brandController");
const Validators = require("../utils/validators/brandValidators");

router
  .route("/")
  .get(Controller.getBrands)
  .post(Validators.createBrandValidation, Controller.createBrand);

router
  .route("/:id")
  .get(Validators.getBrandValidation, Controller.getBrand)
  .put(Validators.updateBrandValidation, Controller.updateBrand)
  .delete(Validators.deleteBrandValidation, Controller.deleteBrand);

module.exports = router;
