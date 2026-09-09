const express = require("express");

const {
  getAbout,
  createAbout,
  updateAbout,
} = require("../controllers/about.home.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const { authorize } = require("../middlewares/role.middleware");

const { upload } = require("../middlewares/upload.middleware");

const router = express.Router();

router.get("/", getAbout);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "mainImage", maxCount: 1 },
    { name: "secondaryImage", maxCount: 1 },
    { name: "founderImage", maxCount: 1 },
  ]),
  createAbout,
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "mainImage", maxCount: 1 },
    { name: "secondaryImage", maxCount: 1 },
    { name: "founderImage", maxCount: 1 },
  ]),
  updateAbout,
);

module.exports = router;
