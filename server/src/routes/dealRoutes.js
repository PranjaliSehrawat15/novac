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

// Admin & Manager can create
router.post("/", authorize("admin", "manager"), createDeal);

// All roles can view (controller should filter by role internally)
router.get("/", authorize("admin", "manager", "employee"), getAllDeals);

// Admin & Manager can update
router.put("/:id", authorize("admin", "manager"), updateDeal);

// Only Admin can delete
router.delete("/:id", authorize("admin"), deleteDeal);

module.exports = router;