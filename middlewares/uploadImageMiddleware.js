const multer = require("multer");
const ApiError = require("../utils/apiError");

// * Multer configuration
const multerOptions = () => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ApiError("Not an image! Please upload only images.", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// * UPLOAD SINGLE IMAGE
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// * Mixed images (single image + multiple images)
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
