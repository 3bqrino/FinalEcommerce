const PromoBanner = require("../models/promo-banner.home.model");
const catchAsync = require("../utilities/catchAsync.util");
const AppError = require("../utilities/appError.util");
const logger = require("../utilities/logger.util");

exports.getPromoBanner = catchAsync(async (req, res, next) => {
  const promoBanner = await PromoBanner.findOne({
    isActive: true,
  });

  if (!promoBanner) {
    return next(new AppError("Promo banner not found", 404));
  }

  res.status(200).json({
    message: "Promo banner fetched successfully",
    data: {
      promoBanner,
    },
  });
});

exports.updatePromoBanner = catchAsync(async (req, res, next) => {
  let promoBanner = await PromoBanner.findOne();

  const { text, discount, link, isActive } = req.body;

  if (!promoBanner) {
    if (!text || !text.trim()) {
      return next(new AppError("Promo banner text is required", 400));
    }

    promoBanner = await PromoBanner.create({
      text: text.trim(),
      discount:
        discount === null || discount === undefined || discount === ""
          ? null
          : Number(discount),
      link: link ? link.trim() : "",
      isActive:
        isActive === undefined
          ? true
          : isActive === true || isActive === "true",
    });

    logger.info(`Promo banner created by admin ${req.user.name}`);
  } else {
    if (text !== undefined) {
      if (!text.trim()) {
        return next(new AppError("Promo banner text is required", 400));
      }

      promoBanner.text = text.trim();
    }

    if (discount !== undefined) {
      if (discount === null || discount === "") {
        promoBanner.discount = null;
      } else if (Number(discount) < 0 || Number.isNaN(Number(discount))) {
        return next(
          new AppError("Discount must be a valid positive number", 400),
        );
      } else {
        promoBanner.discount = Number(discount);
      }
    }

    if (link !== undefined) {
      promoBanner.link = link.trim();
    }

    if (isActive !== undefined) {
      promoBanner.isActive = isActive === true || isActive === "true";
    }

    await promoBanner.save();

    logger.info(`Promo banner updated by admin ${req.user.name}`);
  }

  res.status(200).json({
    message: "Promo banner updated successfully",
    data: {
      promoBanner,
    },
  });
});
