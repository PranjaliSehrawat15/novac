const express = require("express");
const router = express.Router();

const {
  createDeal,
  getAllDeals,
  updateDeal,
  deleteDeal,
} = require("../controllers/dealController");

const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

router.use(protect);

router.post("/", authorize("admin", "manager"), createDeal);
router.get("/", authorize("admin", "manager"), getAllDeals);
router.put("/:id", authorize("admin", "manager"), updateDeal);
router.delete("/:id", authorize("admin"), deleteDeal);

module.exports = router;