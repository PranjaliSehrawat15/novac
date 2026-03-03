const express = require("express");
const {
  createNote,
  getNotesByRelated,
  deleteNote,
} = require("../controllers/noteController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createNote);
router.get("/:relatedId", protect, getNotesByRelated);
router.delete("/:id", protect, deleteNote);

module.exports = router;