const ErrorResponse = require("../utils/errorResponse");

// error handler middleware.
const errorHandler = (err, req, res, next) => {
  console.log("stared....");
  let error = { ...err };
  error.message = err.message;

  console.log(err);
  // console.log(err.name);

  // mongoose bad requiest for ObjectId.
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicated field entered.`;
    error = new ErrorResponse(message, 400);
  }

  // mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((error) => error.message);
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server error" });
};

module.exports = errorHandler;
