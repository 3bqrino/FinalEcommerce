const express = require("express");

const { getReports } = require("../controllers/report.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const { authorize } = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/", authenticate, authorize("admin"), getReports);

module.exports = router;
