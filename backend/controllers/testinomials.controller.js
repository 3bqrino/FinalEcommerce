const Testimonial = require("../models/testnomial.model");
const Message = require("../models/message.model");
const catchAsync = require("../utilities/catchAsync.util");
const AppError = require("../utilities/appError.util");
const logger = require("../utilities/logger.util");
const notifyAdmins = require("../utilities/notifyAdmins.util");

exports.getAllTestimonials = catchAsync(async (req, res) => {
  const testimonials = await Testimonial.find({
    isDeleted: false,
    status: "accepted",
  })
    .populate("user", "name")
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    message: "Testimonials fetched successfully",
    data: {
      testimonials,
    },
  });
});

exports.getMyTestimonials = catchAsync(async (req, res) => {
  const testimonials = await Testimonial.find({
    user: req.user._id,
    isDeleted: false,
  })
    .populate("user", "name email")
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    message: "My testimonials fetched successfully",
    data: {
      testimonials,
    },
  });
});

exports.getAllTestimonialsForAdmin = catchAsync(async (req, res) => {
  const testimonials = await Testimonial.find({
    isDeleted: false,
  })
    .populate("user", "name email")
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    message: "Testimonials fetched successfully",
    data: {
      testimonials,
    },
  });
});

exports.createTestimonial = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;

  if (!comment || rating === undefined) {
    return next(new AppError("Comment and rating are required", 400));
  }

  const myRating = Number(rating);

  if (myRating < 1 || myRating > 5 || Number.isNaN(myRating)) {
    return next(new AppError("Rating must be between 1 and 5", 400));
  }

  if (!comment.trim()) {
    return next(new AppError("Comment cannot be empty", 400));
  }

  const testimonial = await Testimonial.create({
    user: req.user._id,

    name: req.user.name,

    comment: comment.trim(),

    rating: myRating,

    status: "pending",

    isDeleted: false,
  });

  await notifyAdmins({
    type: "new_testimonial",
    title: "New Testimonial",
    message: `New testimonial ${testimonial._id} has been created by ${req.user.name}`,
  });

  logger.info(`Testimonial created: ${testimonial._id} by ${req.user.name}`);

  res.status(201).json({
    message: "Testimonial created successfully",

    data: {
      testimonial,
    },
  });
});

exports.acceptTestimonial = catchAsync(async (req, res, next) => {
  const testimonial = await Testimonial.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!testimonial) {
    return next(new AppError("Testimonial not found", 404));
  }

  if (testimonial.status === "accepted") {
    return next(new AppError("Testimonial is already accepted", 400));
  }

  testimonial.status = "accepted";

  await testimonial.save();

  await Message.create({
    recipient: testimonial.user,

    type: "new_testimonial",

    title: "Testimonial Accepted",

    message:
      "Your testimonial has been accepted and is now visible on the website.",
  });

  logger.info(`Testimonial ${testimonial._id} accepted by ${req.user.name}`);

  res.status(200).json({
    message: "Testimonial accepted successfully",

    data: {
      testimonial,
    },
  });
});

exports.rejectTestimonial = catchAsync(async (req, res, next) => {
  const testimonial = await Testimonial.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!testimonial) {
    return next(new AppError("Testimonial not found", 404));
  }

  if (testimonial.status === "rejected") {
    return next(new AppError("Testimonial is already rejected", 400));
  }

  testimonial.status = "rejected";

  await testimonial.save();

  await Message.create({
    recipient: testimonial.user,

    type: "new_testimonial",

    title: "Testimonial Rejected",

    message: "Your testimonial has been rejected.",
  });

  logger.info(`Testimonial ${testimonial._id} rejected by ${req.user.name}`);

  res.status(200).json({
    message: "Testimonial rejected successfully",

    data: {
      testimonial,
    },
  });
});

exports.deleteTestimonial = catchAsync(async (req, res, next) => {
  const testimonial = await Testimonial.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!testimonial) {
    return next(new AppError("Testimonial not found", 404));
  }

  testimonial.isDeleted = true;

  await testimonial.save();

  logger.info(`Testimonial ${testimonial._id} deleted by ${req.user.name}`);

  res.status(200).json({
    message: "Testimonial deleted successfully",

    data: {
      testimonialId: testimonial._id,
    },
  });
});
