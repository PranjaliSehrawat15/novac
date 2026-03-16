const stageService = require("../services/stageService");

/**
 * Create Stage
 */
exports.createStage = async (req, res) => {
  try {
    const stage = await stageService.createStage(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: stage,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Stages
 */
exports.getStages = async (req, res) => {
  try {
    const stages = await stageService.getStages();

    res.status(200).json({
      success: true,
      count: stages.length,
      data: stages,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Stage
 */
exports.updateStage = async (req, res) => {
  try {
    const existing = await stageService.getStageById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Stage not found",
      });
    }

    const updated = await stageService.updateStage(
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
 * Delete Stage
 */
exports.deleteStage = async (req, res) => {
  try {
    await stageService.deleteStage(req.params.id);

    res.status(200).json({
      success: true,
      message: "Stage deleted successfully",
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};