const express = require("express");
const {
  createActivity,
  getActivities,
  updateActivityStatus,
} = require("../controllers/activityController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createActivity);
router.get("/", protect, getActivities);
router.put("/:id", protect, updateActivityStatus);

module.exports = router;