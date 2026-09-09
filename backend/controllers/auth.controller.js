const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const AppError = require("../utilities/appError.util");
const catchAsync = require("../utilities/catchAsync.util");

const token = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, phone, nationalId, gender, dateOfBirth } =
    req.body;

  if (!name || !email || !password) {
    return next(new AppError("Name, email and password are required", 400));
  }

  if (password.length < 6) {
    return next(new AppError("Password must be at least 6 characters", 400));
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    return next(new AppError("Email is already registered", 409));
  }

  if (gender && !["male", "female"].includes(gender)) {
    return next(new AppError("Gender must be male or female", 400));
  }

  if (dateOfBirth) {
    const birthDate = new Date(dateOfBirth);

    if (Number.isNaN(birthDate.getTime())) {
      return next(new AppError("Invalid date of birth", 400));
    }

    if (birthDate > new Date()) {
      return next(new AppError("Date of birth cannot be in the future", 400));
    }
  }

  const newUser = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    phone: phone ? phone.trim() : "",
    nationalId: nationalId ? nationalId.trim() : "",
    gender: gender || undefined,
    dateOfBirth: dateOfBirth || null,
    role: "user",
  });

  const accessToken = token(newUser);

  res.status(201).json({
    status: "success",
    message: "Account created successfully",
    accessToken,

    data: {
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        nationalId: newUser.nationalId,
        gender: newUser.gender,
        dateOfBirth: newUser.dateOfBirth,
      },
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const myUser = await User.findOne({
    email: email.trim().toLowerCase(),
    isDeleted: false,
  });

  if (!myUser || !(await myUser.isCorrectPassword(password))) {
    return next(new AppError("Invalid email or password", 403));
  }

  if (!myUser.isActive) {
    return next(new AppError("Your account is not active", 401));
  }

  if (myUser.isBlocked) {
    return next(new AppError("Your account is blocked", 402));
  }

  const accessToken = token(myUser);

  res.status(200).json({
    status: "success",
    accessToken,

    data: {
      user: {
        _id: myUser._id,
        name: myUser.name,
        email: myUser.email,
        role: myUser.role,
        phone: myUser.phone,
        nationalId: myUser.nationalId,
        gender: myUser.gender,
        dateOfBirth: myUser.dateOfBirth,
      },
    },
  });
});
