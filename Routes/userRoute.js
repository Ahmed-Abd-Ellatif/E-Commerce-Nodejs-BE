const express = require("express");
const router = express.Router();
const Controller = require("../controllers/userController");
const Validators = require("../utils/validators/userValidators");
const AuthController = require("../controllers/authController");

router
  .route("/")
  .get(AuthController.protect,
     AuthController.allowedTo("admin"),
      Controller.getUsers
    )
  .post(
    AuthController.protect,
    AuthController.allowedTo("admin"),
    Controller.uploadUserImage,
    Controller.resizeImage,
    Validators.createUserValidation,
    Controller.createUser,
  );

router
  .route("/:id")
  .get( AuthController.protect,
     AuthController.allowedTo("admin"),
      Validators.getUserValidation,
       Controller.getUser
      )
  .put(
    AuthController.protect,
    AuthController.allowedTo("admin"),
    Controller.uploadUserImage,
    Controller.resizeImage,
    Validators.updateUserValidation,
    Controller.updateUser,
  )
  .delete(
    AuthController.protect,
    AuthController.allowedTo("admin"),
    Validators.deleteUserValidation,
    Controller.deleteUser
  );

router.put("/change-password/:id",
  AuthController.protect,
  AuthController.allowedTo("admin"),
  Validators.changeUserPasswordValidation,
  Controller.changeUserPassword,
);

module.exports = router;
