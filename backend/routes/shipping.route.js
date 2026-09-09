const express = require("express");

const {
  getShipping,
  updateShipping,
} = require("../controllers/shipping.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const { authorize } = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/", getShipping);

router.put("/", authenticate, authorize("admin"), updateShipping);

module.exports = router;
