const userService = require("../services/userService");
const generateToken = require("../utils/generateToken");

/**
 * 🔑 LOGIN
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 🔍 Get user from Dynamo using GSI3 (email index)
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is not active",
      });
    }

    const isMatch = await userService.comparePassword(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id, // ⚠️ changed from _id to id
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * 👤 GET ME
 */
exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

/**
 * 🔄 CHANGE PASSWORD
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await userService.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await userService.comparePassword(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    await userService.updatePassword(user.id, newPassword);

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
/**
 * 📝 UPDATE PROFILE (name only — email cannot be changed)
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");
    const dynamoDB = require("../config/dynamo");
    const TABLE_NAME = process.env.DYNAMODB_TABLE || "Novac";

    await dynamoDB.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `USER#${req.user.id}`,
          SK: "METADATA",
        },
        UpdateExpression: "SET #name = :name",
        ExpressionAttributeNames: { "#name": "name" },
        ExpressionAttributeValues: { ":name": name.trim() },
      })
    );

    // Update user in response
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        ...req.user,
        name: name.trim(),
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * 🚫 DEACTIVATE SELF
 */
exports.deactivateSelf = async (req, res) => {
  try {
    const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");
    const dynamoDB = require("../config/dynamo");
    const TABLE_NAME = process.env.DYNAMODB_TABLE || "Novac";

    await dynamoDB.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `USER#${req.user.id}`,
          SK: "METADATA", // ⚠️ changed from "METADATA" to "PROFILE#id"
        },
        UpdateExpression: "SET isActive = :isActive",
        ExpressionAttributeValues: { ":isActive": false },
      })
    );

    res.status(200).json({
      success: true,
      message: "Account deactivated. You will be logged out.",
    });
  } catch (error) {
    console.error("Deactivate Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
