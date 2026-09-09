const mongoose = require("mongoose");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const catchAsync = require("../utilities/catchAsync.util");
const AppError = require("../utilities/appError.util");
const logger = require("../utilities/logger.util");

exports.getCart = catchAsync(async (req, res) => {
  const cart = await Cart.findOne({
    user: req.user._id,
  }).populate("items.product");

  if (cart) {
    let priceWasChanged = false;

    for (const item of cart.items) {
      if (!item.product) {
        continue;
      }

      const priceChanged =
        Number(item.priceAtAdd) !== Number(item.product.price);

      if (item.priceChanged !== priceChanged) {
        item.priceChanged = priceChanged;
        priceWasChanged = true;
      }
    }

    if (priceWasChanged) {
      await cart.save();
    }
  }

  res.status(200).json({
    message: "Cart fetched successfully",
    data: {
      cart,
    },
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const myQuantity = Number(quantity) || 1;

  if (myQuantity < 1) {
    return next(new AppError("Quantity must be at least 1", 400));
  }

  const product = await Product.findOne({
    _id: productId,
    isDeleted: false,
    isActive: true,
  });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (product.stock < myQuantity) {
    return next(new AppError("Not enough stock", 400));
  }

  let cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [
        {
          product: product._id,
          quantity: myQuantity,
          priceAtAdd: product.price,
          priceChanged: false,
        },
      ],
    });
  } else {
    const item = cart.items.find(
      (item) => item.product.toString() === productId.toString(),
    );

    if (item) {
      const newQuantity = item.quantity + myQuantity;

      if (newQuantity > product.stock) {
        return next(new AppError("Not enough stock", 400));
      }

      item.quantity = newQuantity;
      item.priceChanged = item.priceAtAdd !== product.price;
    } else {
      cart.items.push({
        product: product._id,
        quantity: myQuantity,
        priceAtAdd: product.price,
        priceChanged: false,
      });
    }

    await cart.save();
  }

  await cart.populate("items.product");

  logger.info(`Product ${product.name} added to cart by ${req.user.name}`);

  res.status(200).json({
    message: "Product added to cart successfully",
    data: {
      cart,
    },
  });
});

exports.updateCartItem = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const myQuantity = Number(quantity);

  if (!myQuantity || myQuantity < 1) {
    return next(new AppError("Quantity must be at least 1", 400));
  }

  const cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId.toString(),
  );

  if (!item) {
    return next(new AppError("Product not found in cart", 404));
  }

  const product = await Product.findOne({
    _id: productId,
    isDeleted: false,
    isActive: true,
  });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (myQuantity > product.stock) {
    return next(new AppError("Not enough stock", 400));
  }

  item.quantity = myQuantity;
  item.priceChanged = item.priceAtAdd !== product.price;

  await cart.save();
  await cart.populate("items.product");

  logger.info(`Cart updated by ${req.user.name}`);

  res.status(200).json({
    message: "Cart updated successfully",
    data: {
      cart,
    },
  });
});

exports.acceptPriceChange = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({
    user: req.user._id,
  }).populate("items.product");

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  for (const item of cart.items) {
    if (!item.product) {
      continue;
    }

    if (Number(item.priceAtAdd) !== Number(item.product.price)) {
      item.priceAtAdd = item.product.price;
    }

    item.priceChanged = false;
  }

  await cart.save();
  await cart.populate("items.product");

  logger.info(`Price changes accepted for cart by ${req.user.name}`);

  res.status(200).json({
    message: "Cart price changes accepted",
    data: {
      cart,
    },
  });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  const oldLength = cart.items.length;

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== req.params.productId,
  );

  if (oldLength === cart.items.length) {
    return next(new AppError("Product not found in cart", 404));
  }

  await cart.save();
  await cart.populate("items.product");

  logger.info(`Product removed from cart by ${req.user.name}`);

  res.status(200).json({
    message: "Product removed from cart successfully",
    data: {
      cart,
    },
  });
});

exports.mergeGuestCart = catchAsync(async (req, res, next) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];

  if (items.length === 0) {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    return res.status(200).json({
      message: "Cart merged successfully",
      data: {
        cart,
      },
    });
  }

  const requested = new Map();

  for (const rawItem of items) {
    const productId = String(rawItem?.productId || "").trim();
    const quantity = Number(rawItem?.quantity);

    if (
      !productId ||
      !mongoose.Types.ObjectId.isValid(productId) ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return next(
        new AppError(
          "Each cart item must contain a valid productId and quantity",
          400,
        ),
      );
    }

    requested.set(productId, (requested.get(productId) || 0) + quantity);
  }

  const productIds = [...requested.keys()];
  const products = await Product.find({
    _id: { $in: productIds },
    isDeleted: false,
    isActive: true,
  });

  if (products.length !== productIds.length) {
    return next(
      new AppError("One or more cart products are no longer available", 400),
    );
  }

  const productMap = new Map(
    products.map((product) => [product._id.toString(), product]),
  );

  let cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: [],
    });
  }

  for (const [productId, requestedQuantity] of requested) {
    const product = productMap.get(productId);
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    const finalQuantity = requestedQuantity + (existingItem?.quantity || 0);

    if (finalQuantity > product.stock) {
      return next(new AppError(`Not enough stock for ${product.name}`, 400));
    }

    if (existingItem) {
      existingItem.quantity = finalQuantity;
      existingItem.priceChanged = existingItem.priceAtAdd !== product.price;
    } else {
      cart.items.push({
        product: product._id,
        quantity: requestedQuantity,
        priceAtAdd: product.price,
        priceChanged: false,
      });
    }
  }

  await cart.save();
  await cart.populate("items.product");

  logger.info(`Guest cart merged into user ${req.user.name}`);

  res.status(200).json({
    message: "Cart merged successfully",
    data: {
      cart,
    },
  });
});

exports.clearCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  cart.items = [];

  await cart.save();

  logger.info(`Cart cleared by ${req.user.name}`);

  res.status(200).json({
    message: "Cart cleared successfully",
    data: {
      cart,
    },
  });
});
