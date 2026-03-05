const express = require("express");
const {
  createNote,
  getNotesByRelated,
  deleteNote,
} = require("../controllers/noteController");

const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", authorize("admin", "manager", "employee"), createNote);
router.get("/:relatedId", authorize("admin", "manager", "employee"), getNotesByRelated);

// Only admin & manager can delete notes
router.delete("/:id", authorize("admin", "manager"), deleteNote);

module.exports = router;