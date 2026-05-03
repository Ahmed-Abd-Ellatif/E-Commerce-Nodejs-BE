const APiError = require("../utils/apiError");
handelJwtInvalidSignature = () =>
  new APiError("Invalid token, Please login again", 401);
handelJwtExpiredSignature = () =>
  new APiError("Your token has expired, Please login again", 401);

// GLOBAL ERROR MIDDLEWARE
const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  // DEVELOPMENT MODE
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    // PRODUCTION MODE
    if (err.name === "JsonWebTokenError") err = handelJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err = handelJwtExpiredSignature();

    sendErrorProd(err, res);
  }
};
// DEVELOPMENT MODE
const sendErrorDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
// PRODUCTION MODE
const sendErrorProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
module.exports = globalError;
