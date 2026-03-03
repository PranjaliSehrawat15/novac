const Lead = require("../models/Lead");

// Create Lead (Admin only)
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Leads (Role-Based Filtering)
exports.getLeads = async (req, res) => {
  try {
    let leads;

    if (req.user.role === "admin") {
      leads = await Lead.find().populate("assignedTo manager", "name email role");
    }

    else if (req.user.role === "manager") {
      leads = await Lead.find({ manager: req.user._id })
        .populate("assignedTo manager", "name email role");
    }

    else {
      leads = await Lead.find({ assignedTo: req.user._id })
        .populate("assignedTo manager", "name email role");
    }

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};