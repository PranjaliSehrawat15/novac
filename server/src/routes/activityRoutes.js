const express = require("express");
const {
  createActivity,
  getActivities,
  updateActivityStatus,
} = require("../controllers/activityController");

const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// All authenticated users can create & view
router.post("/", authorize("admin", "manager", "employee"), createActivity);
router.get("/", getActivities);

// Only admin & manager can update activity status
router.put("/:id", authorize("admin", "manager"), updateActivityStatus);

module.exports = router;