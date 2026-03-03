const express = require("express");
const router = express.Router();

const leadController = require("../controllers/leadController");
const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

router.post(
  "/",
  protect,
  authorize("admin"),
  leadController.createLead
);