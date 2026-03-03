const express = require("express");
const {
  createStage,
  getStages,
  updateStage,
} = require("../controllers/stageController");

const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("admin"), createStage);
router.get("/", protect, getStages);
router.put("/:id", protect, authorize("admin"), updateStage);

module.exports = router;