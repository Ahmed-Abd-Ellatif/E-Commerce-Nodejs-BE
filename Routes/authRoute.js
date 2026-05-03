const express = require("express");
const router = express.Router();
const Controller = require("../controllers/authController");
const Validators = require("../utils/validators/authValidators");

router.route("/signup").post(Validators.signupValidation, Controller.signup);
router.route("/login").post(Validators.loginValidation, Controller.login);

// router
//   .route("/:id")
//   .get(Validators.getUserValidation, Controller.getUser)
//   .put(
//     Controller.uploadUserImage,
//     Controller.resizeImage,
//     Validators.updateUserValidation,
//     Controller.updateUser,
//   )
//   .delete(Validators.deleteUserValidation, Controller.deleteUser);

module.exports = router;
