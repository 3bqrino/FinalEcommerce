const express = require("express");

const {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/order.controller");

const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

const router = express.Router();

router.post("/", authenticate, createOrder);

router.get("/my-orders", authenticate, getMyOrders);

router.get("/user/:userId", authenticate, authorize("admin"), getOrdersByUser);

router.get("/", authenticate, authorize("admin"), getAllOrders);
router.get("/:id", authenticate, authorize("admin"), getOrderById);
router.put("/:id/status", authenticate, authorize("admin"), updateOrderStatus);

module.exports = router;
