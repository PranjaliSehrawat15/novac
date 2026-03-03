// const User = require("../models/User");

// // ✅ Get all users (Admin only)
// // exports.getAllUsers = async (req, res) => {
// //   const users = await User.find().select("-password");

// //   res.json({
// //     success: true,
// //     count: users.length,
// //     data: users,
// //   });
// // };
// exports.getAllUSers = async (req, res,) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json({
//       success: true,
//       count: users.length,
//       data: users,
//     });
//   }catch(error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };




// // ✅ Get single user
// // exports.getUserById = async (req, res) => {
// //   const user = await User.findById(req.params.id).select("-password");

// //   if (!user) {
// //     return res.status(404).json({ success: false, message: "User not found" });
// //   }

// //   res.json({ success: true, data: user });
// // };

// exports.getUSerById = async(req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");

//     if(!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: user
//     })
//   }catch(error) {
//     res.status(500).json({
//       success: false,
//       message: "Invalid user Id"
//     });
//   }
// }






// // ✅ Update user role
// // exports.updateUserRole = async (req, res) => {
// //   const { role } = req.body;

// //   const user = await User.findByIdAndUpdate(
// //     req.params.id,
// //     { role },
// //     { new: true }
// //   ).select("-password");

// //   res.json({
// //     success: true,
// //     message: "Role updated",
// //     data: user,
// //   });
// // };

// exports.updateUserRole = async(req, res) => {
//   try {
//     const { role } = req.body;

//     if(req.user.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Only admin can update roles",
//       });
//     }

//     const allowedRoles = ["admin", "manager", "employee"];

//     if(!allowedRoles.includes(role)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid role",
//       });
//     } 

//     const user = await user.findById(req.params.id);
//     if(!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     user.role = role;
//     await user.save();

//     res.json({
//       success: true,
//       message: "Role updated",
//       data: user,
//     });
//   }catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// }






// // ✅ Activate / Deactivate user
// // exports.toggleUserStatus = async (req, res) => {
// //   const { isActive } = req.body;

// //   const user = await User.findByIdAndUpdate(
// //     req.params.id,
// //     { isActive },
// //     { new: true }
// //   ).select("-password");

// //   res.json({
// //     success: true,
// //     message: "User status updated",
// //     data: user,
// //   });
// // };

// exports.toggleUserStatus = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Only admin can change status",
//       });
//     }

//     const { isActive } = req.body;

//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { isActive },
//       { new: true }
//     ).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "User status updated",
//       data: user,
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };





// // Register User
// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // 1️⃣ Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // 2️⃣ Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // 3️⃣ Create user
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       user,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


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


// ✅ Get single user
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
};


// ✅ Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
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

    const user = await User.create({
      name,
      email,
      password, // send plain password
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};