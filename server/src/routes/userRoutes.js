const express = require("express");
const router = express.Router();

const {
  getAllUsers,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

// Admin only routes
router.get("/", protect, authorize("admin"), getAllUsers);

// Admin & Manager can create users
// router.post(
//   "/register",
//   protect,
//   authorize("admin", "manager"),
//   registerUser
// );

module.exports = router;