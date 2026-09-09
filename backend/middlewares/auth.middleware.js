const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "fail",
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const myUser = await User.findOne({
      _id: decoded.id,
      isActive: true,
      isDeleted: false,
      isBlocked: false,
    }).select("-password");

    if (!myUser) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token",
      });
    }

    req.user = myUser;

    next();
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid or expired token",
    });
  }
};
