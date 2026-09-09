const express = require("express");

const {
  getAllSubCategories,
  getOneSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subCategory.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const { authorize } = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/", authenticate, authorize("admin"), getAllSubCategories);

router.get("/:id", authenticate, authorize("admin"), getOneSubCategory);

router.post("/", authenticate, authorize("admin"), createSubCategory);

router.put("/:id", authenticate, authorize("admin"), updateSubCategory);

router.delete("/:id", authenticate, authorize("admin"), deleteSubCategory);

module.exports = router;
