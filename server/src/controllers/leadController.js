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

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const user = req.user;

    // 🔐 Admin can update everything
    if (user.role === "admin") {
      Object.assign(lead, req.body);
    }

    // 🔐 Manager can update only their leads
    else if (user.role === "manager") {
      if (lead.manager.toString() !== user.id) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this lead",
        });
      }

      Object.assign(lead, req.body);
    }

    // 🔐 Sales can update only status & notes of assigned leads
    else if (user.role === "sales") {
      if (
        !lead.assignedTo ||
        lead.assignedTo.toString() !== user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this lead",
        });
      }

      // Allow only specific fields
      lead.status = req.body.status || lead.status;
      lead.notes = req.body.notes || lead.notes;
    }

    await lead.save();

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteLead = async(req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if(!lead) {
      return res.send(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: "lead deleted xuccessfully",
    });
  }catch(error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}