const multer = require("multer");
const ApiError = require("../utils/apiError");

exports.uploadSingleImage = (fieldName) => {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // * Configure Multer Storage
  // * DiskStorage
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     const filename = `category-${uuidv4()}-${Date.now()}-${file.originalname}`;
  //     cb(null, filename);
  //   },
  // });
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // * MemoryStorage
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const multerStorage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ApiError("Not an image! Please upload only images.", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload.single(fieldName);
};
