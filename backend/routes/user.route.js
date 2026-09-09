const express = require("express");

const {
  getAllUsers,
  getUserById,
  getUserHistory,
  createAdmin,
  deleteUser,
  blockUser,
  unblockUser,
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/user.controller");

const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/me", authenticate, getMyProfile);
router.put("/me", authenticate, updateMyProfile);
router.put("/me/password", authenticate, changeMyPassword);

router.get("/me/addresses", authenticate, getAddresses);
router.post("/me/addresses", authenticate, addAddress);
router.put("/me/addresses/:addressId", authenticate, updateAddress);
router.put("/me/addresses/:addressId/default", authenticate, setDefaultAddress);
router.delete("/me/addresses/:addressId", authenticate, deleteAddress);

router.get("/", authenticate, authorize("admin"), getAllUsers);

router.post("/admin", authenticate, authorize("admin"), createAdmin);

router.get("/:id/history", authenticate, authorize("admin"), getUserHistory);

router.get("/:id", authenticate, authorize("admin"), getUserById);

router.delete("/:id", authenticate, authorize("admin"), deleteUser);
router.put("/:id/block", authenticate, authorize("admin"), blockUser);
router.put("/:id/unblock", authenticate, authorize("admin"), unblockUser);

module.exports = router;
