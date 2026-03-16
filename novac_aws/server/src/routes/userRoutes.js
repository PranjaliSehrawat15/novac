const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getTeamMembers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  registerUser,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

router.use(protect);

// Admin + Manager can view team (controller filters by role)
router.get("/team", authorize("admin", "manager"), getTeamMembers);

// Admin only routes
router.get("/", authorize("admin"), getAllUsers);
router.get("/:id", authorize("admin"), getUserById);
router.patch("/:id/role", authorize("admin"), updateUserRole);

// Admin can toggle any user; Manager can toggle employees (controller enforces the rule)
router.patch("/:id/status", authorize("admin", "manager"), toggleUserStatus);

// Admin & Manager can create users
router.post("/register", authorize("admin", "manager"), registerUser);

module.exports = router;