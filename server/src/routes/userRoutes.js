const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  registerUser,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

router.use(protect);

// Admin only routes
router.get("/", authorize("admin"), getAllUsers);
router.get("/:id", authorize("admin"), getUserById);
router.patch("/:id/role", authorize("admin"), updateUserRole);
router.patch("/:id/status", authorize("admin"), toggleUserStatus);

// Admin & Manager can create users
router.post("/register", authorize("admin", "manager"), registerUser);

module.exports = router;