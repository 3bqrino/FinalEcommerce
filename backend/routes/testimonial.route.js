const express = require("express");

const {
  getAllTestimonials,
  getMyTestimonials,
  getAllTestimonialsForAdmin,
  createTestimonial,
  acceptTestimonial,
  rejectTestimonial,
  deleteTestimonial,
} = require("../controllers/testinomials.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const { authorize } = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/", getAllTestimonials);

router.get("/me", authenticate, getMyTestimonials);

router.post("/", authenticate, createTestimonial);

router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  getAllTestimonialsForAdmin,
);

router.put(
  "/admin/:id/accept",
  authenticate,
  authorize("admin"),
  acceptTestimonial,
);

router.put(
  "/admin/:id/reject",
  authenticate,
  authorize("admin"),
  rejectTestimonial,
);

router.delete(
  "/admin/:id",
  authenticate,
  authorize("admin"),
  deleteTestimonial,
);

module.exports = router;
