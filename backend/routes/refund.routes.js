const express = require("express");

const {
  createRefund,
  getMyRefunds,
  getAllRefunds,
  getRefundById,
  approveRefund,
  rejectRefund,
} = require("../controllers/refund.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const { authorize } = require("../middlewares/role.middleware");

const router = express.Router();

router.post("/", authenticate, createRefund);

router.get("/my", authenticate, getMyRefunds);

router.get("/", authenticate, authorize("admin"), getAllRefunds);

router.get("/:id", authenticate, authorize("admin"), getRefundById);

router.put("/:id/approve", authenticate, authorize("admin"), approveRefund);

router.put("/:id/reject", authenticate, authorize("admin"), rejectRefund);

module.exports = router;
