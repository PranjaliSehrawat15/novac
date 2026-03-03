const Activity = require("../models/Activity");

exports.createActivity = async (req, res) => {
  try {
    const activity = await Activity.create({
      ...req.body,
      createdBy: req.user.id,
    });

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