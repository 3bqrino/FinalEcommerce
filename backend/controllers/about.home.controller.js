const About = require("../models/about.home.model");
const catchAsync = require("../utilities/catchAsync.util");
const AppError = require("../utilities/appError.util");
const logger = require("../utilities/logger.util");

exports.getAbout = catchAsync(async (req, res) => {
  const about = await About.findOne({ isActive: true }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    message: "About fetched successfully",
    data: {
      about: about || null,
    },
  });
});

exports.createAbout = catchAsync(async (req, res, next) => {
  const { title, description, founderName, founderRole, manifesto, isActive } =
    req.body;

  if (!title || !title.trim() || !description || !description.trim()) {
    return next(new AppError("Title and description are required", 400));
  }

  const about = await About.create({
    title: title.trim(),
    description: description.trim(),
    founderName: founderName ? founderName.trim() : "",
    founderRole: founderRole ? founderRole.trim() : "",
    manifesto: manifesto ? manifesto.trim() : "",
    isActive:
      isActive === undefined
        ? true
        : isActive === true || isActive === "true",
    image:
      req.files?.mainImage?.[0]?.filename ||
      req.files?.image?.[0]?.filename ||
      null,
    secondaryImage: req.files?.secondaryImage?.[0]?.filename || null,
    founderImage: req.files?.founderImage?.[0]?.filename || null,
  });

  logger.info(`About created by admin ${req.user.name}`);

  res.status(201).json({
    message: "About created successfully",
    data: {
      about,
    },
  });
});

exports.updateAbout = catchAsync(async (req, res, next) => {
  const about = await About.findById(req.params.id);

  if (!about) {
    return next(new AppError("About not found", 404));
  }

  const { title, description, founderName, founderRole, manifesto, isActive } =
    req.body;

  if (title !== undefined) {
    if (!title.trim()) {
      return next(new AppError("Title cannot be empty", 400));
    }

    about.title = title.trim();
  }

  if (description !== undefined) {
    if (!description.trim()) {
      return next(new AppError("Description cannot be empty", 400));
    }

    about.description = description.trim();
  }

  if (founderName !== undefined) {
    about.founderName = founderName.trim();
  }

  if (founderRole !== undefined) {
    about.founderRole = founderRole.trim();
  }

  if (manifesto !== undefined) {
    about.manifesto = manifesto.trim();
  }

  if (isActive !== undefined) {
    about.isActive = isActive === true || isActive === "true";
  }

  if (req.files?.mainImage?.[0]) {
    about.image = req.files.mainImage[0].filename;
  }

  if (req.files?.image?.[0]) {
    about.image = req.files.image[0].filename;
  }

  if (req.files?.secondaryImage?.[0]) {
    about.secondaryImage = req.files.secondaryImage[0].filename;
  }

  if (req.files?.founderImage?.[0]) {
    about.founderImage = req.files.founderImage[0].filename;
  }

  await about.save();

  logger.info(`About updated by admin ${req.user.name}`);

  res.status(200).json({
    message: "About updated successfully",
    data: {
      about,
    },
  });
});