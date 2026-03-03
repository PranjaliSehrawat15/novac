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

exports.getActivities = async (req, res) => {
  try {
    let activities;

    if (req.user.role === "admin") {
      activities = await Activity.find().populate("assignedTo createdBy");
    } else {
      activities = await Activity.find({
        assignedTo: req.user.id,
      }).populate("assignedTo createdBy");
    }

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

exports.updateActivityStatus = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    activity.status = req.body.status || activity.status;

    await activity.save();

    res.status(200).json({
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