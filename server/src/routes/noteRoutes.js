const express = require("express");
const {
  createNote,
  getNotesByRelated,
} = require("../controllers/noteController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createNote);
router.get("/:relatedId", protect, getNotesByRelated);

module.exports = router;