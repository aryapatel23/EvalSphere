const ApiError = require("../utils/apiError");

const errorMiddleware = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    details: process.env.NODE_ENV === "development" ? err.message : null,
  });
};

module.exports = errorMiddleware;
