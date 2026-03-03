const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

// Admin only routes
router.get("/", protect, authorize("admin"), getAllUsers);
router.get("/:id", protect, authorize("admin"), getUserById);

// Admin & Manager can create users
// router.post(
//   "/register",
//   protect,
//   authorize("admin", "manager"),
//   registerUser
// );

module.exports = router;