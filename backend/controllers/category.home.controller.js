const Category = require("../models/category.model");

const catchAsync = require("../utilities/catchAsync.util");
const AppError = require("../utilities/appError.util");

exports.getHomeCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({
    isActive: true,
    isDeleted: false,
  })
    .select("name slug description image")
    .sort({
      createdAt: -1,
    });

  if (categories.length === 0) {
    return next(new AppError("No categories found", 404));
  }

  res.status(200).json({
    message: "Home categories fetched successfully",

    data: {
      categories,
    },
  });
});
