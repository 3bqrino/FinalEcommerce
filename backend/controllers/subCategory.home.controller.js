const SubCategory = require("../models/sub-category.model");

const catchAsync = require("../utilities/catchAsync.util");

const AppError = require("../utilities/appError.util");

exports.getHomeSubCategories = catchAsync(async (req, res, next) => {
  const subCategories = await SubCategory.find({
    isActive: true,
    isDeleted: false,
  })
    .populate("category", "name slug")
    .sort({
      createdAt: -1,
    });

  if (subCategories.length === 0) {
    return next(new AppError("No subcategories found", 404));
  }

  res.status(200).json({
    message: "Home subcategories fetched successfully",
    data: {
      subCategories,
    },
  });
});
