const express = require("express");
const router = express.Router();

const leadController = require("../controllers/leadController");
const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

router.use(protect);

// Only Admin can create leads
router.post("/", authorize("admin"), leadController.createLead);

// All roles can view leads
router.get("/", authorize("admin", "manager", "employee"), leadController.getLeads);

// Admin & Manager can update
router.put("/:id", authorize("admin", "manager"), leadController.updateLead);

// Only Admin can delete
router.delete("/:id", authorize("admin"), leadController.deleteLead);

module.exports = router;