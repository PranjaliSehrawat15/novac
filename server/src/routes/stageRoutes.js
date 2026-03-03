const express = require("express");
const {
  createStage,
  getStages,
} = require("../controllers/stageController");

const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("admin"), createStage);
router.get("/", protect, getStages);

module.exports = router;