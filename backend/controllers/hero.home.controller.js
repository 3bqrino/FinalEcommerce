const Hero = require("../models/hero.home.model");

const catchAsync = require("../utilities/catchAsync.util");
const AppError = require("../utilities/appError.util");
const logger = require("../utilities/logger.util");

exports.getAllHeroes = catchAsync(async (req, res) => {
  const heroes = await Hero.find({
    isActive: true,
  }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    message: "Heroes fetched successfully",
    data: {
      heroes,
    },
  });
});

exports.getOneHero = catchAsync(async (req, res, next) => {
  const hero = await Hero.findById(req.params.id);

  if (!hero) {
    return next(new AppError("Hero not found", 404));
  }

  res.status(200).json({
    message: "Hero fetched successfully",
    data: {
      hero,
    },
  });
});

exports.createHero = catchAsync(async (req, res, next) => {
  const { eyebrow, drop, title, accent, description, isActive } = req.body;

  if (!title || !title.trim()) {
    return next(new AppError("Hero title is required", 400));
  }

  if (!req.file) {
    return next(new AppError("Hero image is required", 400));
  }

  const hero = await Hero.create({
    eyebrow: eyebrow?.trim() || "",
    drop: drop?.trim() || "",
    title: title.trim(),
    accent: accent?.trim() || "",
    description: description?.trim() || "",
    image: req.file.filename,

    isActive:
      isActive === undefined ? true : isActive === true || isActive === "true",
  });

  logger.info(`Hero created: ${hero.title} by admin ${req.user.name}`);

  res.status(201).json({
    message: "Hero created successfully",
    data: {
      hero,
    },
  });
});

exports.updateHero = catchAsync(async (req, res, next) => {
  const hero = await Hero.findById(req.params.id);

  if (!hero) {
    return next(new AppError("Hero not found", 404));
  }

  const { eyebrow, drop, title, accent, description, isActive } = req.body;

  if (eyebrow !== undefined) {
    hero.eyebrow = eyebrow.trim();
  }

  if (drop !== undefined) {
    hero.drop = drop.trim();
  }

  if (title !== undefined) {
    if (!title.trim()) {
      return next(new AppError("Hero title cannot be empty", 400));
    }

    hero.title = title.trim();
  }

  if (accent !== undefined) {
    hero.accent = accent.trim();
  }

  if (description !== undefined) {
    hero.description = description.trim();
  }

  if (isActive !== undefined) {
    hero.isActive = isActive === true || isActive === "true";
  }

  if (req.file) {
    hero.image = req.file.filename;
  }

  await hero.save();

  logger.info(`Hero updated: ${hero.title} by admin ${req.user.name}`);

  res.status(200).json({
    message: "Hero updated successfully",
    data: {
      hero,
    },
  });
});

exports.deleteHero = catchAsync(async (req, res, next) => {
  const hero = await Hero.findById(req.params.id);

  if (!hero) {
    return next(new AppError("Hero not found", 404));
  }

  await hero.deleteOne();

  logger.info(`Hero deleted: ${hero.title} by admin ${req.user.name}`);

  res.status(200).json({
    message: "Hero deleted successfully",
    data: {
      heroId: hero._id,
    },
  });
});
