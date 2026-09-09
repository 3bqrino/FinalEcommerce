const express = require("express");

const {
  getHomeSubCategories,
} = require("../controllers/subCategory.home.controller");

const router = express.Router();

router.get("/", getHomeSubCategories);

module.exports = router;
