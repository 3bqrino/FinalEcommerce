const mongoose = require("mongoose");

const Refund = require("../models/refund.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Message = require("../models/message.model");

const catchAsync = require("../utilities/catchAsync.util");
const AppError = require("../utilities/appError.util");
const logger = require("../utilities/logger.util");
const notifyAdmins = require("../utilities/notifyAdmins.util");

exports.createRefund = catchAsync(async (req, res, next) => {
  const { orderId, reason } = req.body;

  if (!orderId || !reason?.trim()) {
    return next(new AppError("Order ID and refund reason are required", 400));
  }

  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  if (order.status !== "delivered") {
    return next(
      new AppError("Refund can only be requested for delivered orders", 400),
    );
  }

  const existingRefund = await Refund.findOne({
    order: order._id,
    user: req.user._id,
    status: {
      $in: ["pending", "refunded"],
    },
  });

  if (existingRefund) {
    return next(
      new AppError("A refund request already exists for this order", 409),
    );
  }

  const refund = await Refund.create({
    order: order._id,
    user: req.user._id,
    amount: order.totalAmount,
    reason: reason.trim(),
    status: "pending",
  });

  await notifyAdmins({
    type: "refund_request",
    title: "New Refund Request",
    message: `Refund request ${refund._id} was created for order ${order._id} by ${req.user.name}`,
  });

  logger.info(
    `Refund request created: ${refund._id} for order ${order._id} by ${req.user.name}`,
  );

  res.status(201).json({
    message: "Refund request created successfully",

    data: {
      refund,
    },
  });
});

exports.getMyRefunds = catchAsync(async (req, res) => {
  const refunds = await Refund.find({
    user: req.user._id,
  })
    .populate("order", "totalAmount status createdAt")
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    message: "Refunds fetched successfully",

    data: {
      refunds,
    },
  });
});

exports.getAllRefunds = catchAsync(async (req, res) => {
  const refunds = await Refund.find()
    .populate("user", "name email phone")
    .populate("order", "totalAmount status createdAt")
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    message: "Refunds fetched successfully",

    data: {
      refunds,
    },
  });
});

exports.getRefundById = catchAsync(async (req, res, next) => {
  const refund = await Refund.findById(req.params.id)
    .populate("user", "name email phone")
    .populate("order");

  if (!refund) {
    return next(new AppError("Refund not found", 404));
  }

  res.status(200).json({
    message: "Refund fetched successfully",

    data: {
      refund,
    },
  });
});

exports.approveRefund = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const refund = await Refund.findById(req.params.id).session(session);

    if (!refund) {
      await session.abortTransaction();

      return next(new AppError("Refund not found", 404));
    }

    if (refund.status !== "pending") {
      await session.abortTransaction();

      return next(
        new AppError(
          `Refund cannot be approved from ${refund.status} status`,
          400,
        ),
      );
    }

    const order = await Order.findById(refund.order)
      .populate("items.product")
      .session(session);

    if (!order) {
      await session.abortTransaction();

      return next(new AppError("Order not found", 404));
    }

    if (order.status !== "delivered") {
      await session.abortTransaction();

      return next(new AppError("Only delivered orders can be refunded", 400));
    }

    for (const item of order.items) {
      if (!item.product) {
        continue;
      }

      await Product.findByIdAndUpdate(
        item.product._id,
        {
          $inc: {
            stock: item.quantity,
          },
        },
        {
          session,
        },
      );
    }

    refund.status = "refunded";

    refund.adminNote = req.body.adminNote?.trim() || "";

    refund.processedAt = new Date();

    await refund.save({
      session,
    });

    order.status = "refunded";

    await order.save({
      session,
    });

    await session.commitTransaction();

    await Message.create({
      recipient: refund.user,
      type: "refund_completed",
      title: "Refund Completed",
      message: `Your refund for order ${order._id} has been completed.`,
    });

    logger.info(`Refund ${refund._id} completed by ${req.user.name}`);

    res.status(200).json({
      message: "Refund completed successfully",

      data: {
        refund,
        order,
      },
    });
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
});

exports.rejectRefund = catchAsync(async (req, res, next) => {
  const refund = await Refund.findById(req.params.id);

  if (!refund) {
    return next(new AppError("Refund not found", 404));
  }

  if (refund.status !== "pending") {
    return next(
      new AppError(
        `Refund cannot be rejected from ${refund.status} status`,
        400,
      ),
    );
  }

  refund.status = "rejected";

  refund.adminNote = req.body.adminNote?.trim() || "";

  await refund.save();

  await Message.create({
    recipient: refund.user,
    type: "refund_rejected",
    title: "Refund Rejected",
    message: `Your refund request for order ${refund.order} has been rejected.`,
  });

  logger.info(`Refund ${refund._id} rejected by ${req.user.name}`);

  res.status(200).json({
    message: "Refund rejected successfully",

    data: {
      refund,
    },
  });
});
