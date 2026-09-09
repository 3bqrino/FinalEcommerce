const SubCategory = require("../models/sub-category.model");

const Category = require("../models/category.model");

const catchAsync = require("../utilities/catchAsync.util");

const AppError = require("../utilities/appError.util");

const logger = require("../utilities/logger.util");

exports.getAllSubCategories = catchAsync(async (req, res) => {
  const subCategories = await SubCategory.find({
    isDeleted: false,
  })
    .populate("category", "name slug")
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    message: "Subcategories fetched successfully",
    data: {
      subCategories,
    },
  });
});

exports.getOneSubCategory = catchAsync(async (req, res, next) => {
  const subCategory = await SubCategory.findOne({
    _id: req.params.id,
    isDeleted: false,
  }).populate("category", "name slug");

  if (!subCategory) {
    return next(new AppError("Subcategory not found", 404));
  }

  res.status(200).json({
    message: "Subcategory fetched successfully",
    data: {
      subCategory,
    },
  });
});

exports.createSubCategory = catchAsync(async (req, res, next) => {
  const { name, slug, category, isActive } = req.body;

  if (!name || !slug || !category) {
    return next(new AppError("Name, slug and category are required", 400));
  }

  const categoryDoc = await Category.findOne({
    _id: category,
    isDeleted: false,
  });

  if (!categoryDoc) {
    return next(new AppError("Category not found", 404));
  }

  const normalizedSlug = slug.trim().toLowerCase();

  const existingSubCategory = await SubCategory.findOne({
    slug: normalizedSlug,
  });

  if (existingSubCategory) {
    return next(new AppError("Subcategory slug already exists", 409));
  }

  const subCategory = await SubCategory.create({
    name: name.trim(),
    slug: normalizedSlug,
    category,
    isActive:
      isActive === undefined ? true : isActive === true || isActive === "true",
  });

  const populatedSubCategory = await SubCategory.findById(
    subCategory._id,
  ).populate("category", "name slug");

  logger.info(
    `Subcategory created: ${subCategory.name} by admin ${req.user.name}`,
  );

  res.status(201).json({
    message: "Subcategory created successfully",
    data: {
      subCategory: populatedSubCategory,
    },
  });
});

exports.updateSubCategory = catchAsync(async (req, res, next) => {
  const subCategory = await SubCategory.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!subCategory) {
    return next(new AppError("Subcategory not found", 404));
  }

  const { name, slug, category, isActive } = req.body;

  if (name !== undefined) {
    if (!name.trim()) {
      return next(new AppError("Subcategory name cannot be empty", 400));
    }

    subCategory.name = name.trim();
  }

  if (slug !== undefined) {
    const normalizedSlug = slug.trim().toLowerCase();

    const existingSubCategory = await SubCategory.findOne({
      slug: normalizedSlug,
      _id: {
        $ne: subCategory._id,
      },
      isDeleted: false,
    });

    if (existingSubCategory) {
      return next(new AppError("Subcategory slug already exists", 409));
    }

    subCategory.slug = normalizedSlug;
  }

  if (category !== undefined) {
    const categoryDoc = await Category.findOne({
      _id: category,
      isDeleted: false,
    });

    if (!categoryDoc) {
      return next(new AppError("Category not found", 404));
    }

    subCategory.category = category;
  }

  if (isActive !== undefined) {
    subCategory.isActive = isActive === true || isActive === "true";
  }

  await subCategory.save();

  const updatedSubCategory = await SubCategory.findById(
    subCategory._id,
  ).populate("category", "name slug");

  logger.info(
    `Subcategory updated: ${subCategory.name} by admin ${req.user.name}`,
  );

  res.status(200).json({
    message: "Subcategory updated successfully",
    data: {
      subCategory: updatedSubCategory,
    },
  });
});

exports.deleteSubCategory = catchAsync(async (req, res, next) => {
  const subCategory = await SubCategory.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!subCategory) {
    return next(new AppError("Subcategory not found", 404));
  }

  subCategory.isDeleted = true;

  subCategory.isActive = false;

  await subCategory.save();

  logger.info(
    `Subcategory deleted: ${subCategory.name} by admin ${req.user.name}`,
  );

  res.status(200).json({
    message: "Subcategory deleted successfully",
    data: {
      subCategoryId: subCategory._id,
    },
  });
});
