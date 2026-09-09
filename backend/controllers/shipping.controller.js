const Shipping = require("../models/shipping.model");
const catchAsync = require("../utilities/catchAsync.util");
const AppError = require("../utilities/appError.util");
const logger = require("../utilities/logger.util");

exports.getShipping = catchAsync(async (req, res) => {
  const shipping = await Shipping.findOneAndUpdate(
    {},
    {
      $setOnInsert: {
        shippingFee: 0,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  res.status(200).json({
    message: "Shipping fetched successfully",
    data: {
      shipping,
    },
  });
});

exports.updateShipping = catchAsync(async (req, res, next) => {
  const { shippingFee } = req.body;

  if (shippingFee === undefined || shippingFee === null || shippingFee === "") {
    return next(new AppError("Shipping fee is required", 400));
  }

  const fee = Number(shippingFee);

  if (!Number.isFinite(fee)) {
    return next(new AppError("Shipping fee must be a valid number", 400));
  }

  if (fee < 0) {
    return next(new AppError("Shipping fee cannot be negative", 400));
  }

  const shipping = await Shipping.findOneAndUpdate(
    {},
    {
      shippingFee: fee,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  logger.info(
    `Shipping fee updated to ${shipping.shippingFee} by admin ${req.user.name}`,
  );

  res.status(200).json({
    message: "Shipping updated successfully",
    data: {
      shipping,
    },
  });
});
