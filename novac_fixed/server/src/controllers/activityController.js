const activityService = require("../services/activityService");

/**
 * Create Activity
 */
exports.createActivity = async (req, res) => {
  try {
    const activity = await activityService.createActivity(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: activity,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Activities
 */
exports.getActivities = async (req, res) => {
  try {
    const activities = await activityService.getActivities(req.user);

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Activity Status
 */
exports.updateActivityStatus = async (req, res) => {
  try {
    const existing = await activityService.getActivityById(
      req.params.id
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    const updated = await activityService.updateActivityStatus(
      req.params.id,
      req.body.status
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