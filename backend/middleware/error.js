const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  // Wrong MongoDB ID
  if (err.name === "CastError") {
    const message = `Resources not found with this id.. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key
  if (err.code === 11000) {
    const message = `Duplicate key ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT
  if (err.name === "JsonWebTokenError") {
    const message = `Your url is invalid please try again letter`;
    err = new ErrorHandler(message, 400);
  }

  // JWT expired
  if (err.name === "TokenExpiredError") {
    const message = `Your Url is expired please try again letter!`;
    err = new ErrorHandler(message, 400);
  }

  // Error Display
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};