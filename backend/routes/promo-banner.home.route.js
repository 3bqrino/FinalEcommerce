const express = require("express");

const {
  getPromoBanner,
  updatePromoBanner,
} = require("../controllers/promo-banner.home.controller");

const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/", getPromoBanner);

router.put("/", authenticate, authorize("admin"), updatePromoBanner);

module.exports = router;
