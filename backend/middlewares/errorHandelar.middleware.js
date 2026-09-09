const logger = require("../utilities/logger.util");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const userInfo = req.user ? `${req.user.name} - ${req.user._id}` : "guest";

  logger.error(
    `Error found | ${err.statusCode} | ${req.method} ${req.originalUrl} : ${err.message} | user: ${userInfo}`,
    {
      stack: err.stack,
    },
  );

  if (process.env.NODE_ENV === "dev") {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};
