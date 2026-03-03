const express = require("express");
const router = express.Router();

const {
  createDeal,
  getAllDeals,
  updateDeal,
} = require("../controllers/dealController");

const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

router.use(protect);

router.post("/", authorize("admin", "manager"), createDeal);
router.get("/", authorize("admin", "manager"), getAllDeals);
router.put("/:id", authorize("admin", "manager"), updateDeal);

module.exports = router;