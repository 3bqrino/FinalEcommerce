const express = require("express");

const {
  getFooter,
  updateFooter,
} = require("../controllers/footer.home.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const { authorize } = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/", getFooter);

router.put("/", authenticate, authorize("admin"), updateFooter);

module.exports = router;
