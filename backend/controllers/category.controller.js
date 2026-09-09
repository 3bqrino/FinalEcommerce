const Category = require("../models/category.model");

const catchAsync = require("../utilities/catchAsync.util");
const AppError = require("../utilities/appError.util");
const logger = require("../utilities/logger.util");

exports.getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({
    isDeleted: false,
  });

  res.status(200).json({
    message: "Categories fetched successfully",
    data: {
      categories,
    },
  });
});

exports.getOneCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    message: "Category fetched successfully",
    data: {
      category,
    },
  });
});

exports.getCategoryBySlug = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({
    slug: req.params.slug,
    isDeleted: false,
  });

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    message: "Category fetched successfully",
    data: {
      category,
    },
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const { name, slug, description, isActive } = req.body;

  if (!name || !slug) {
    return next(new AppError("Category name and slug are required", 400));
  }

  const myCategory = await Category.findOne({
    slug: slug.trim().toLowerCase(),
  });

  if (myCategory) {
    return next(new AppError("Category slug already exists", 409));
  }

  const category = await Category.create({
    name: name.trim(),
    slug: slug.trim().toLowerCase(),
    description,
    isActive:
      isActive === undefined ? true : isActive === true || isActive === "true",
    image: req.file ? req.file.filename : null,
  });

  logger.info(`Category created: ${category.name} by admin ${req.user.name}`);

  res.status(201).json({
    message: "Category created successfully",
    data: {
      category,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  const { name, slug, description, isActive } = req.body;

  if (name !== undefined) {
    category.name = name.trim();
  }

  if (slug !== undefined) {
    const newSlug = slug.trim().toLowerCase();

    const myCategory = await Category.findOne({
      slug: newSlug,
      _id: {
        $ne: req.params.id,
      },
    });

    if (myCategory) {
      return next(new AppError("Category slug already exists", 409));
    }

    category.slug = newSlug;
  }

  if (description !== undefined) {
    category.description = description;
  }

  if (isActive !== undefined) {
    category.isActive = isActive === "true" || isActive === true;
  }

  if (req.file) {
    category.image = req.file.filename;
  }

  await category.save();

  logger.info(`Category updated: ${category.name} by admin ${req.user.name}`);

  res.status(200).json({
    message: "Category updated successfully",
    data: {
      category,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  category.isDeleted = true;
  category.isActive = false;

  await category.save();

  logger.info(`Category deleted: ${category.name} by admin ${req.user.name}`);

  res.status(200).json({
    message: "Category deleted successfully",
  });
});
