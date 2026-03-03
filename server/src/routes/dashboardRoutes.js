const express = require("express");
const {
  getSummary,
  getPipeline,
  getPerformance,
} = require("../controllers/dashboardController");

const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/summary", protect, authorize("admin", "manager"), getSummary);
router.get("/pipeline", protect, authorize("admin", "manager"), getPipeline);
router.get("/performance", protect, authorize("admin", "manager"), getPerformance);

module.exports = router;