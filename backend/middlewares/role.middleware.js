exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "You must be logged in",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "Access denied",
      });
    }

    next();
  };
};
