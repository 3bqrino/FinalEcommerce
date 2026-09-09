const express = require("express");

const {
  getHomeCategories,
} = require("../controllers/category.home.controller");

const router = express.Router();

router.get("/", getHomeCategories);

module.exports = router;
