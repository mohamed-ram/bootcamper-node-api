// error handler middleware.
const errorHandler = (err, req, res, next) => {
  console.log("Error: ", err.stack);
  res
    .status(err.statusCode || 500)
    .json({ success: false, error: err.message || "Server error" });
};

module.exports = errorHandler;
