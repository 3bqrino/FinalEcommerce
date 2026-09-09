const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeGuestCart,
  acceptPriceChange,
} = require("../controllers/cart.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.get("/", getCart);

router.post("/", addToCart);

router.post("/merge", mergeGuestCart);

router.put("/price-change/accept", acceptPriceChange);

router.put("/", updateCartItem);

router.delete("/clear", clearCart);

router.delete("/:productId", removeFromCart);

module.exports = router;
