const Message = require("../models/message.model");

const catchAsync = require("../utilities/catchAsync.util");
const AppError = require("../utilities/appError.util");
const logger = require("../utilities/logger.util");

exports.getMessage = catchAsync(async (req, res) => {
  const messages = await Message.find({
    recipient: req.user._id,
    isDeleted: false,
  }).sort("-createdAt");

  res.status(200).json({
    message: "Messages fetched successfully",

    data: {
      messages,
    },
  });
});

exports.markRead = catchAsync(async (req, res, next) => {
  const message = await Message.findOneAndUpdate(
    {
      _id: req.params.id,
      recipient: req.user._id,
      isDeleted: false,
    },
    {
      isRead: true,
    },
    {
      new: true,
    },
  );

  if (!message) {
    return next(new AppError("Message not found", 404));
  }

  logger.info(`Message ${message._id} marked as read by ${req.user.name}`);

  res.status(200).json({
    message: "Message read successfully",

    data: {
      message,
    },
  });
});

exports.markDeleted = catchAsync(async (req, res, next) => {
  const message = await Message.findOneAndUpdate(
    {
      _id: req.params.id,
      recipient: req.user._id,
      isDeleted: false,
    },
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );

  if (!message) {
    return next(new AppError("Message not found", 404));
  }

  logger.info(`Message ${message._id} deleted by ${req.user.name}`);

  res.status(200).json({
    message: "Message deleted successfully",

    data: {
      message,
    },
  });
});

exports.markAllRead = catchAsync(async (req, res) => {
  await Message.updateMany(
    {
      recipient: req.user._id,
      isDeleted: false,
      isRead: false,
    },
    {
      isRead: true,
    },
  );

  res.status(200).json({
    message: "All messages marked as read",
  });
});

exports.deleteAllRead = catchAsync(async (req, res) => {
  await Message.updateMany(
    {
      recipient: req.user._id,
      isDeleted: false,
      isRead: true,
    },
    {
      isDeleted: true,
    },
  );

  res.status(200).json({
    message: "Read messages deleted successfully",
  });
});
