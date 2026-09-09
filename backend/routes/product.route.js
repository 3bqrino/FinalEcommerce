const express = require("express");

const Product = require("../models/product.model");

const {
  getAllProducts,
  getAllProductsForAdmin,
  getProductBySlug,
  getRelatedProducts,
  getProductsByCategory,
  getProductById,
  getProductByIdForAdmin,
  getLowStockProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const { authorize } = require("../middlewares/role.middleware");

const { upload } = require("../middlewares/upload.middleware");

const pagination = require("../middlewares/pagination.middleware");

const router = express.Router();

router.get(
  "/",
  pagination(Product, {
    isDeleted: false,
    isActive: true,
  }),
  getAllProducts,
);

router.get("/category/:slug", getProductsByCategory);

router.get("/slug/:slug", getProductBySlug);

router.get("/related/:slug", getRelatedProducts);

router.get(
  "/admin/all",
  authenticate,
  authorize("admin"),
  pagination(Product, {
    isDeleted: false,
  }),
  getAllProductsForAdmin,
);

router.get(
  "/admin/low-stock",
  authenticate,
  authorize("admin"),
  getLowStockProducts,
);

router.get(
  "/admin/:id",
  authenticate,
  authorize("admin"),
  getProductByIdForAdmin,
);

router.get("/:id", getProductById);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  createProduct,
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  updateProduct,
);

router.delete("/:id", authenticate, authorize("admin"), deleteProduct);

module.exports = router;
