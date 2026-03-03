const User = require("../models/User");
const bcrypt = require("bcryptjs");


// ✅ Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get single user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid user Id",
    });
  }
};

// ✅ Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Only admin can update roles
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can update roles",
      });
    }

    const allowedRoles = ["admin", "manager", "employee"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findById(req.params.id); // ✅ fixed here

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 Prevent admin from downgrading themselves
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot change their own role",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: "Role updated",
      data: user,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Activate / Deactivate user
exports.toggleUserStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can change status",
      });
    }

    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User status updated",
      data: user,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}