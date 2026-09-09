const express = require("express");

const {
  getMessage,
  markRead,
  markDeleted,
  markAllRead,
  deleteAllRead,
} = require("../controllers/message.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate);
router.get("/", getMessage);
router.put("/:id/read", markRead);
router.put("/:id/delete", markDeleted);
router.put("/read-all", markAllRead);
router.put("/delete-all-read", deleteAllRead);

module.exports = router;
