const express = require("express");
const router = express.Router();

const {
  createDeal,
} = require("../controllers/dealController");

const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

router.use(protect);

router.post("/", authorize("admin", "manager"), createDeal);

module.exports = router;