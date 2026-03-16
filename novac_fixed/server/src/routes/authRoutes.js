const express = require("express");
const router = express.Router();

const { login, getMe, changePassword, updateProfile, deactivateSelf } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/change-password", protect, changePassword);
router.put("/update-profile", protect, updateProfile);
router.put("/deactivate", protect, deactivateSelf);

module.exports = router;
