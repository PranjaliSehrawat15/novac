const express = require("express");
const {
  createStage,
} = require("../controllers/stageController");

const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("admin"), createStage);

module.exports = router;