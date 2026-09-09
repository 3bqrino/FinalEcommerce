const express = require("express");

const {
  getAllHeroes,
  getOneHero,
  createHero,
  updateHero,
  deleteHero,
} = require("../controllers/hero.home.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const { authorize } = require("../middlewares/role.middleware");

const { upload } = require("../middlewares/upload.middleware");

const router = express.Router();

router.get("/", getAllHeroes);

router.get("/:id", getOneHero);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  createHero,
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  updateHero,
);

router.delete("/:id", authenticate, authorize("admin"), deleteHero);

module.exports = router;
