const mongoose = require("mongoose");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const Refund = require("../models/refund.model");
const Testimonial = require("../models/testnomial.model");

const catchAsync = require("../utilities/catchAsync.util");
const AppError = require("../utilities/appError.util");
const logger = require("../utilities/logger.util");

exports.getAllUsers = catchAsync(async (req, res) => {
  const search = String(req.query.search || "").trim();
  const hasPagination =
    req.query.page !== undefined ||
    req.query.limit !== undefined ||
    Boolean(search);

  const baseFilter = {
    isDeleted: false,
  };

  if (!hasPagination) {
    const users = await User.find(baseFilter)
      .select("-password")
      .sort({ createdAt: -1 });

    logger.info("All users fetched successfully", {
      userId: req.user?._id,
      count: users.length,
    });

    return res.status(200).json({
      message: "Users fetched successfully",
      data: {
        users,
      },
    });
  }

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);
  const skip = (page - 1) * limit;

  const filter = { ...baseFilter };

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(escapedSearch, "i");
    const searchConditions = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { nationalId: searchRegex },
    ];

    if (mongoose.Types.ObjectId.isValid(search)) {
      searchConditions.push({ _id: search });
    }

    filter.$or = searchConditions;
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  logger.info("Users directory queried successfully", {
    userId: req.user?._id,
    search: search || null,
    page,
    limit,
    count: users.length,
    total,
  });

  return res.status(200).json({
    message: "Users fetched successfully",
    data: {
      users,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total,
      },
    },
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id,
    isDeleted: false,
  }).select("-password");

  if (!user) {
    logger.warn("User not found", {
      userId: req.params.id,
      requestedBy: req.user?._id,
    });

    return next(new AppError("User not found", 404));
  }

  logger.info("User fetched successfully", {
    userId: user._id,
    requestedBy: req.user?._id,
  });

  res.status(200).json({
    message: "User fetched successfully",
    data: {
      user,
    },
  });
});

exports.createAdmin = catchAsync(async (req, res, next) => {
  const { name, email, password, phone, nationalId, gender, dateOfBirth } =
    req.body;

  if (
    !name?.trim() ||
    !email?.trim() ||
    !password ||
    !phone?.trim() ||
    !nationalId?.trim() ||
    !gender
  ) {
    return next(
      new AppError(
        "Name, email, password, phone, national ID and gender are required",
        400,
      ),
    );
  }

  if (password.length < 6) {
    return next(new AppError("Password must be at least 6 characters", 400));
  }

  if (!["male", "female"].includes(gender)) {
    return next(new AppError("Gender must be male or female", 400));
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    return next(new AppError("Email is already registered", 409));
  }

  let parsedDate = null;

  if (dateOfBirth) {
    parsedDate = new Date(dateOfBirth);

    if (Number.isNaN(parsedDate.getTime())) {
      return next(new AppError("Invalid date of birth", 400));
    }

    if (parsedDate > new Date()) {
      return next(new AppError("Date of birth cannot be in the future", 400));
    }
  }

  const admin = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    phone: phone.trim(),
    nationalId: nationalId.trim(),
    gender,
    dateOfBirth: parsedDate,
    role: "admin",
    isActive: true,
    isBlocked: false,
    isDeleted: false,
  });

  const safeAdmin = admin.toObject();
  delete safeAdmin.password;

  logger.info("New admin created successfully", {
    adminId: admin._id,
    createdBy: req.user?._id,
  });

  res.status(201).json({
    message: "Admin created successfully",
    data: {
      admin: safeAdmin,
    },
  });
});

exports.getUserHistory = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id,
    isDeleted: false,
  }).select("_id name email role");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const [orders, refunds, testimonials] = await Promise.all([
    Order.find({ user: user._id })
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 }),

    Refund.find({ user: user._id })
      .populate("order", "totalAmount status createdAt")
      .sort({ createdAt: -1 }),

    Testimonial.find({
      user: user._id,
      isDeleted: false,
    }).sort({ createdAt: -1 }),
  ]);

  res.status(200).json({
    message: "User history fetched successfully",
    data: {
      user,
      history: {
        orders,
        refunds,
        testimonials,
      },
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  user.isDeleted = true;

  await user.save();

  logger.info("User deleted successfully", {
    userId: user._id,
    deletedBy: req.user?._id,
  });

  const safeUser = user.toObject();

  delete safeUser.password;

  res.status(200).json({
    message: "User deleted successfully",
    data: {
      user: safeUser,
    },
  });
});

exports.blockUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!user) {
    logger.warn("Failed to block user - user not found", {
      userId: req.params.id,
      requestedBy: req.user?._id,
    });

    return next(new AppError("User not found", 404));
  }

  user.isBlocked = true;

  await user.save();

  logger.info("User blocked successfully", {
    userId: user._id,
    blockedBy: req.user?._id,
  });

  const safeUser = user.toObject();

  delete safeUser.password;

  res.status(200).json({
    message: "User blocked successfully",
    data: {
      user: safeUser,
    },
  });
});

exports.unblockUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!user) {
    logger.warn("Failed to unblock user - user not found", {
      userId: req.params.id,
      requestedBy: req.user?._id,
    });

    return next(new AppError("User not found", 404));
  }

  user.isBlocked = false;

  await user.save();

  logger.info("User unblocked successfully", {
    userId: user._id,
    unblockedBy: req.user?._id,
  });

  const safeUser = user.toObject();

  delete safeUser.password;

  res.status(200).json({
    message: "User unblocked successfully",
    data: {
      user: safeUser,
    },
  });
});

exports.getMyProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    message: "Profile fetched successfully",
    data: {
      user,
    },
  });
});

exports.updateMyProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const { name, phone, nationalId, gender, dateOfBirth } = req.body;

  if (name !== undefined) {
    if (!name.trim()) {
      return next(new AppError("Name cannot be empty", 400));
    }

    user.name = name.trim();
  }

  if (phone !== undefined) {
    if (!phone.trim()) {
      return next(new AppError("Phone cannot be empty", 400));
    }

    user.phone = phone.trim();
  }

  if (nationalId !== undefined) {
    if (!nationalId.trim()) {
      return next(new AppError("National ID cannot be empty", 400));
    }

    user.nationalId = nationalId.trim();
  }

  if (gender !== undefined) {
    if (!["male", "female"].includes(gender)) {
      return next(new AppError("Invalid gender", 400));
    }

    user.gender = gender;
  }

  if (dateOfBirth !== undefined) {
    if (dateOfBirth === null || dateOfBirth === "") {
      user.dateOfBirth = null;
    } else {
      const parsedDate = new Date(dateOfBirth);

      if (Number.isNaN(parsedDate.getTime())) {
        return next(new AppError("Invalid date of birth", 400));
      }

      if (parsedDate > new Date()) {
        return next(new AppError("Date of birth cannot be in the future", 400));
      }

      user.dateOfBirth = parsedDate;
    }
  }

  await user.save();

  const safeUser = user.toObject();

  delete safeUser.password;

  logger.info(`User profile updated by ${user.name}`, {
    userId: user._id,
  });

  res.status(200).json({
    message: "Profile updated successfully",
    data: {
      user: safeUser,
    },
  });
});

exports.changeMyPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(
      new AppError("Current password and new password are required", 400),
    );
  }

  if (newPassword.length < 6) {
    return next(
      new AppError("New password must be at least 6 characters", 400),
    );
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isCorrect = await user.isCorrectPassword(currentPassword);

  if (!isCorrect) {
    return next(new AppError("Current password is incorrect", 403));
  }

  user.password = newPassword;

  await user.save();

  logger.info(`Password changed by user ${user._id}`);

  res.status(200).json({
    message: "Password changed successfully",
  });
});

exports.addAddress = catchAsync(async (req, res, next) => {
  const { name, governorate, city, street, building } = req.body;

  if (!name || !governorate || !city || !street || !building) {
    logger.warn("Failed to add address - missing fields", {
      userId: req.user?._id,
    });

    return next(new AppError("All address fields are required", 400));
  }

  const isFirstAddress = req.user.address.length === 0;

  req.user.address.push({
    name: name.trim(),
    governorate: governorate.trim(),
    city: city.trim(),
    street: street.trim(),
    building: building.trim(),
    isDefault: isFirstAddress,
  });

  await req.user.save();

  logger.info("Address added successfully", {
    userId: req.user._id,
    isDefault: isFirstAddress,
  });

  res.status(201).json({
    message: "Address added successfully",
    data: {
      addresses: req.user.address,
    },
  });
});

exports.updateAddress = catchAsync(async (req, res, next) => {
  const address = req.user.address.id(req.params.addressId);

  if (!address) {
    logger.warn("Failed to update address - address not found", {
      userId: req.user._id,
      addressId: req.params.addressId,
    });

    return next(new AppError("Address not found", 404));
  }

  const { name, governorate, city, street, building } = req.body;

  if (name !== undefined) {
    address.name = name.trim();
  }

  if (governorate !== undefined) {
    address.governorate = governorate.trim();
  }

  if (city !== undefined) {
    address.city = city.trim();
  }

  if (street !== undefined) {
    address.street = street.trim();
  }

  if (building !== undefined) {
    address.building = building.trim();
  }

  await req.user.save();

  logger.info("Address updated successfully", {
    userId: req.user._id,
    addressId: address._id,
  });

  res.status(200).json({
    message: "Address updated successfully",
    data: {
      addresses: req.user.address,
    },
  });
});

exports.deleteAddress = catchAsync(async (req, res, next) => {
  const address = req.user.address.id(req.params.addressId);

  if (!address) {
    logger.warn("Failed to delete address - address not found", {
      userId: req.user._id,
      addressId: req.params.addressId,
    });

    return next(new AppError("Address not found", 404));
  }

  const wasDefault = address.isDefault;

  address.deleteOne();

  if (wasDefault && req.user.address.length > 0) {
    req.user.address[0].isDefault = true;
  }

  await req.user.save();

  logger.info("Address deleted successfully", {
    userId: req.user._id,
    addressId: req.params.addressId,
    wasDefault,
  });

  res.status(200).json({
    message: "Address deleted successfully",
    data: {
      addresses: req.user.address,
    },
  });
});

exports.setDefaultAddress = catchAsync(async (req, res, next) => {
  const address = req.user.address.id(req.params.addressId);

  if (!address) {
    logger.warn("Failed to set default address - address not found", {
      userId: req.user._id,
      addressId: req.params.addressId,
    });

    return next(new AppError("Address not found", 404));
  }

  req.user.address.forEach((item) => {
    item.isDefault = false;
  });

  address.isDefault = true;

  await req.user.save();

  logger.info("Default address updated successfully", {
    userId: req.user._id,
    addressId: address._id,
  });

  res.status(200).json({
    message: "Default address updated successfully",
    data: {
      addresses: req.user.address,
    },
  });
});

exports.getAddresses = catchAsync(async (req, res) => {
  logger.info("User addresses fetched", {
    userId: req.user._id,
    count: req.user.address.length,
  });

  res.status(200).json({
    message: "Addresses fetched successfully",
    data: {
      addresses: req.user.address,
    },
  });
});
