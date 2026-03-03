const Lead = require("../models/Lead");
const Deal = require("../models/Deals");
const Stage = require("../models/Stage");

exports.getSummary = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const totalDeals = await Deal.countDocuments();

    const closedWonStage = await Stage.findOne({ name: "Closed Won" });
    const closedLostStage = await Stage.findOne({ name: "Closed Lost" });

    const closedWonDeals = closedWonStage
      ? await Deal.countDocuments({ stage: closedWonStage._id })
      : 0;

    const closedLostDeals = closedLostStage
      ? await Deal.countDocuments({ stage: closedLostStage._id })
      : 0;

    const revenueData = await Deal.aggregate([
      {
        $lookup: {
          from: "stages",
          localField: "stage",
          foreignField: "_id",
          as: "stageInfo",
        },
      },
      { $unwind: "$stageInfo" },
      { $match: { "stageInfo.name": "Closed Won" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$value" },
        },
      },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        totalDeals,
        closedWonDeals,
        closedLostDeals,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPipeline = async (req, res) => {
  try {
    const pipeline = await Deal.aggregate([
      {
        $lookup: {
          from: "stages",
          localField: "stage",
          foreignField: "_id",
          as: "stageInfo",
        },
      },
      { $unwind: "$stageInfo" },
      {
        $group: {
          _id: "$stageInfo.name",
          count: { $sum: 1 },
          revenue: { $sum: "$value" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: pipeline,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPerformance = async (req, res) => {
  try {
    const performance = await Deal.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $group: {
          _id: "$userInfo.name",
          totalDeals: { $sum: 1 },
          revenue: { $sum: "$value" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: performance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};