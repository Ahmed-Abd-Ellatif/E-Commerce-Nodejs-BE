const express = require("express");
const router = express.Router();
const Controller = require("../controllers/userController");
const Validators = require("../utils/validators/userValidators");

router
  .route("/")
  .get(Controller.getUsers)
  .post(
    Controller.uploadUserImage,
    Controller.resizeImage,
    Validators.createUserValidation,
    Controller.createUser,
  );

router
  .route("/:id")
  .get(Validators.getUserValidation, Controller.getUser)
  .put(
    Controller.uploadUserImage,
    Controller.resizeImage,
    Validators.updateUserValidation,
    Controller.updateUser,
  )
  .delete(Validators.deleteUserValidation, Controller.deleteUser);

router.put(
  "/change-password/:id",
  Validators.changeUserPasswordValidation,
  Controller.changeUserPassword,
);

module.exports = router;
