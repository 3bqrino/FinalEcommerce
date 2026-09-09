const express = require("express");

const {
  getAllCategories,
  getOneCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const { authorize } = require("../middlewares/role.middleware");

const { upload } = require("../middlewares/upload.middleware");

const router = express.Router();

router.get("/", getAllCategories);

router.get("/slug/:slug", getCategoryBySlug);

router.get("/:id", getOneCategory);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  createCategory,
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  updateCategory,
);
router.delete("/:id", authenticate, authorize("admin"), deleteCategory);

module.exports = router;
