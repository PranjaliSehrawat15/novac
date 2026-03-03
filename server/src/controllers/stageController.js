const Stage = require("../models/Stage");

exports.createStage = async (req, res) => {
  try {
    const stage = await Stage.create({
      ...req.body,
      createdBy: req.user.id,
    });

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

exports.getStages = async (req, res) => {
  try {
    const stages = await Stage.find().sort("order");

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