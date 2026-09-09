const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Shipping = require("../models/shipping.model");
const Message = require("../models/message.model");

const catchAsync = require("../utilities/catchAsync.util");
const AppError = require("../utilities/appError.util");
const logger = require("../utilities/logger.util");
const notifyAdmins = require("../utilities/notifyAdmins.util");

exports.createOrder = catchAsync(async (req, res, next) => {
  const { shippingAddress } = req.body;

  if (!shippingAddress) {
    return next(new AppError("Shipping address is required", 400));
  }

  const { name, governorate, city, street, building } = shippingAddress;

  if (!name || !governorate || !city || !street || !building) {
    return next(new AppError("Complete shipping address is required", 400));
  }

  const cart = await Cart.findOne({
    user: req.user._id,
  }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  const shipping = await Shipping.findOneAndUpdate(
    {},
    { $setOnInsert: { shippingFee: 0 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  const deliveryFee = Number(shipping.shippingFee || 0);

  const items = [];

  let subtotal = 0;

  for (const item of cart.items) {
    const product = item.product;

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    if (product.isDeleted || !product.isActive) {
      return next(new AppError(`${product.name} is not available`, 400));
    }

    if (Number(item.priceAtAdd) !== Number(product.price)) {
      return next(
        new AppError(
          "A product price has changed. Please review your cart before checkout.",
          409,
        ),
      );
    }

    if (product.stock < item.quantity) {
      return next(new AppError(`Not enough stock for ${product.name}`, 400));
    }
  }

  const updatedProducts = [];

  for (const item of cart.items) {
    const product = item.product;

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: product._id,
        isDeleted: false,
        isActive: true,
        stock: {
          $gte: item.quantity,
        },
      },
      {
        $inc: {
          stock: -item.quantity,
        },
      },
      {
        new: true,
      },
    );

    if (!updatedProduct) {
      for (const previous of updatedProducts) {
        await Product.findByIdAndUpdate(previous.productId, {
          $inc: {
            stock: previous.quantity,
          },
        });
      }

      return next(new AppError(`Not enough stock for ${product.name}`, 400));
    }

    updatedProducts.push({
      productId: product._id,
      quantity: item.quantity,
    });

    const totalPrice = product.price * item.quantity;

    items.push({
      product: product._id,
      name: product.name,
      image: product.image,
      quantity: item.quantity,
      price: product.price,
      totalPrice,
    });

    subtotal += totalPrice;
  }

  const totalAmount = subtotal + deliveryFee;

  let order;

  try {
    order = await Order.create({
      user: req.user._id,

      items,

      shippingAddress: {
        name,
        governorate,
        city,
        street,
        building,
      },

      subtotal,
      deliveryFee,
      totalAmount,

      status: "pending",
    });
  } catch (error) {
    for (const previous of updatedProducts) {
      await Product.findByIdAndUpdate(previous.productId, {
        $inc: {
          stock: previous.quantity,
        },
      });
    }

    throw error;
  }

  try {
    cart.items = [];

    await cart.save();
  } catch (error) {
    for (const previous of updatedProducts) {
      await Product.findByIdAndUpdate(previous.productId, {
        $inc: {
          stock: previous.quantity,
        },
      });
    }

    await Order.findByIdAndDelete(order._id);

    throw error;
  }

  await notifyAdmins({
    type: "new_order",
    title: "New Order",
    message: `${req.user.name} ordered ${items.map((item) => `${item.name} x${item.quantity}`).join(", ")}`,
  });

  logger.info(`Order created: ${order._id} by ${req.user.name}`);

  res.status(201).json({
    message: "Order created successfully",

    data: {
      order,
    },
  });
});

exports.getAllOrders = catchAsync(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email phone")
    .populate("items.product")
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    message: "Orders fetched successfully",

    data: {
      orders,
    },
  });
});

exports.getMyOrders = catchAsync(async (req, res) => {
  const myOrders = await Order.find({
    user: req.user._id,
  })
    .populate("items.product")
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    message: "Orders fetched successfully",

    data: {
      orders: myOrders,
    },
  });
});

exports.getOrdersByUser = catchAsync(async (req, res, next) => {
  const orders = await Order.find({
    user: req.params.userId,
  })
    .populate("user", "name email phone")
    .populate("items.product")
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    message: "User orders fetched successfully",

    data: {
      orders,
    },
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email phone")
    .populate("items.product");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    message: "Order fetched successfully",

    data: {
      order,
    },
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  const allowedStatus = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  if (!allowedStatus.includes(status)) {
    return next(new AppError("Invalid order status", 400));
  }

  const order = await Order.findById(req.params.id).populate("items.product");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  const currentStatus = order.status;

  if (currentStatus === status) {
    return next(new AppError(`Order is already ${status}`, 400));
  }

  if (
    status === "cancelled" &&
    currentStatus !== "cancelled" &&
    currentStatus !== "delivered" &&
    currentStatus !== "refunded"
  ) {
    for (const item of order.items) {
      const product = item.product;

      if (!product) {
        continue;
      }

      await Product.findByIdAndUpdate(product._id, {
        $inc: {
          stock: item.quantity,
        },
      });
    }
  }

  order.status = status;

  await order.save();

  const statusMessages = {
    pending: "is pending.",
    confirmed: "has been confirmed.",
    processing: "is now being processed.",
    shipped: "has been shipped.",
    delivered: "has been delivered.",
    cancelled: "has been cancelled.",
    refunded: "has been refunded.",
  };

  if (statusMessages[status]) {
    const productNames = order.items
      .map((item) => `${item.name} x${item.quantity}`)
      .join(", ");

    const customer = await require("../models/user.model")
      .findById(order.user)
      .select("name");

    const customerName = customer?.name || "Customer";

    await Message.create({
      recipient: order.user,
      type: "order_status",
      title: "Order Update",
      message: `${customerName}: ${productNames} ${statusMessages[status]}`,
    });
  }

  logger.info(
    `Order ${order._id} status changed from ${currentStatus} to ${status} by ${req.user.name}`,
  );

  const updatedOrder = await Order.findById(order._id)
    .populate("user", "name email phone")
    .populate("items.product");

  res.status(200).json({
    message: "Order status updated successfully",

    data: {
      order: updatedOrder,
    },
  });
});
