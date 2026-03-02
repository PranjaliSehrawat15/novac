const express = require("express");
const router = express.Router();
const {
  login,
  getMe,
  changePassword
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");

router.post("/login", login);


module.exports = router;