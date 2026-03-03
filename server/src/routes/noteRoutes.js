const express = require("express");
const {
  createNote,
} = require("../controllers/noteController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createNote);

module.exports = router;