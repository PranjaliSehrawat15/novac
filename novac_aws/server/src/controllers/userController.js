const userService = require("../services/userService");

/**
 * ✅ Get team members
 *    - Admin: all users
 *    - Manager: all employees (they can manage)
 *    - Employee: 403
 */
exports.getTeamMembers = async (req, res) => {
  try {
    const requesterRole = req.user.role;

    if (requesterRole === "employee") {
      return res.status(403).json({
        success: false,
        message: "Employees cannot view team members",
      });
    }

    const users = await userService.getAllUsers();

    // Managers only see employees (and themselves)
    if (requesterRole === "manager") {
      const visible = users.filter(
        (u) => u.role === "employee" || u.id === req.user.id
      );
      return res.json({ success: true, count: visible.length, data: visible });
    }

    // Admin sees everyone
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ✅ Get all users (Admin only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can view all users",
      });
    }

    const users = await userService.getAllUsers();

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

/**
 * ✅ Get single user
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    delete user.password;

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

/**
 * ✅ Update user role (Admin only)
 */
exports.updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can update roles",
      });
    }

    const { role } = req.body;

    const allowedRoles = ["admin", "manager", "employee"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 Prevent admin from changing their own role
    if (req.user.id === user.id) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot change their own role",
      });
    }

    const updatedUser = await userService.updateUserRole(user.id, role);

    res.json({
      success: true,
      message: "Role updated",
      data: updatedUser,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ✅ Activate / Deactivate user
 *    - Admin can toggle manager or employee
 *    - Manager can toggle employee only
 *    - Employee cannot toggle anyone
 */
exports.toggleUserStatus = async (req, res) => {
  try {
    const requesterRole = req.user.role;

    // Employees are not allowed at all
    if (requesterRole === "employee") {
      return res.status(403).json({
        success: false,
        message: "Employees cannot change user status",
      });
    }

    const { isActive } = req.body;

    // Fetch target user first
    const targetUser = await userService.getUserById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Managers can only deactivate/activate employees
    if (requesterRole === "manager" && targetUser.role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "Managers can only change status of employees",
      });
    }

    // Prevent self-deactivation
    if (req.user.id === targetUser.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own active status",
      });
    }

    const updatedUser = await userService.toggleUserStatus(
      req.params.id,
      isActive
    );

    res.json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: updatedUser,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ✅ Register User
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 🔥 Role hierarchy protection
    if (req.user.role === "manager" && role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "Managers can only create employees",
      });
    }

    const allowedRoles = ["admin", "manager", "employee"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await userService.createUser({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};