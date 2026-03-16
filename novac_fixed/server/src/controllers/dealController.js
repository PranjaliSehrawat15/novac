const dealService = require("../services/dealService");

/**
 * Create Deal
 */
exports.createDeal = async (req, res) => {
  try {
    const deal = await dealService.createDeal(req.body, req.user.id);

    res.status(201).json({
      success: true,
      data: deal,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Deals
 */
exports.getAllDeals = async (req, res) => {
  try {
    const deals = await dealService.getDeals(req.user);

    res.status(200).json({
      success: true,
      count: deals.length,
      data: deals,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Deal
 */
exports.updateDeal = async (req, res) => {
  try {
    const existing = await dealService.getDealById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    const updated = await dealService.updateDeal(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: updated,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Deal
 */
exports.deleteDeal = async (req, res) => {
  try {
    await dealService.deleteDeal(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deal deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};