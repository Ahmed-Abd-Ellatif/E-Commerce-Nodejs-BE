const express = require("express");
const router = express.Router();
const Controller = require("../controllers/authController");
const Validators = require("../utils/validators/authValidators");

router.route("/signup").post(Validators.signupValidation, Controller.signup);
router.route("/login").post(Validators.loginValidation, Controller.login);
router.route("/forgetPassword").post( Controller.forgetPassword);
router.route("/verifyResetCode").post( Controller.verifyResetCode);
router.route("/resetPassword").post( Controller.resetPassword);





module.exports = router;
