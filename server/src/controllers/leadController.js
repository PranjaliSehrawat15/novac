const leadService = require("../services/leadService");

/**
 * Create Lead
 */
exports.createLead = async (req, res) => {
  try {
    const lead = await leadService.createLead(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get Leads
 */
exports.getLeads = async (req, res) => {
  try {
    const leads = await leadService.getLeads(req.user);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update Lead
 */
exports.updateLead = async (req, res) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const updated = await leadService.updateLead(
      lead,
      req.body,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updated,
    });

  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Lead
 */
exports.deleteLead = async (req, res) => {
  try {
    await leadService.deleteLead(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.assignLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    const lead = await leadService.getLeadById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    const updatedLead = await leadService.updateLead(
      lead,
      { assignedTo: `USER#${employeeId}` },
      req.user
    );

    res.json({
      success: true,
      data: updatedLead
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update Lead Status (Pipeline Stage)
 */
exports.updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const lead = await leadService.getLeadById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    const updatedLead = await leadService.updateLead(
      lead,
      { status },
      req.user
    );

    res.json({
      success: true,
      data: updatedLead
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};