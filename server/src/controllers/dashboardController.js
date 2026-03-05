const dynamoDB = require("../config/dynamo");
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = "Novac";

/**
 * 🔹 Get Summary
 */
exports.getSummary = async (req, res) => {
  try {
    const result = await dynamoDB.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      })
    );

    const items = result.Items;

    const leads = items.filter((i) => i.entity === "LEAD");
    const deals = items.filter((i) => i.entity === "DEAL");

    const totalLeads = leads.length;
    const totalDeals = deals.length;

    const closedWonDeals = deals.filter(
      (d) => d.stage === "Closed Won"
    ).length;

    const closedLostDeals = deals.filter(
      (d) => d.stage === "Closed Lost"
    ).length;

    const totalRevenue = deals
      .filter((d) => d.stage === "Closed Won")
      .reduce((sum, d) => sum + (d.value || 0), 0);

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

/**
 * 🔹 Get Pipeline
 */
exports.getPipeline = async (req, res) => {
  try {
    const result = await dynamoDB.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      })
    );

    const deals = result.Items.filter(
      (i) => i.entity === "DEAL"
    );

    const pipelineMap = {};

    deals.forEach((deal) => {
      const stage = deal.stage || "Unknown";

      if (!pipelineMap[stage]) {
        pipelineMap[stage] = {
          _id: stage,
          count: 0,
          revenue: 0,
        };
      }

      pipelineMap[stage].count += 1;
      pipelineMap[stage].revenue += deal.value || 0;
    });

    const pipeline = Object.values(pipelineMap);

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

/**
 * 🔹 Get Performance (Deals per assigned user)
 */
exports.getPerformance = async (req, res) => {
  try {
    const result = await dynamoDB.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      })
    );

    const deals = result.Items.filter(
      (i) => i.entity === "DEAL"
    );

    const performanceMap = {};

    deals.forEach((deal) => {
      const userKey = deal.assignedTo || "Unassigned";

      if (!performanceMap[userKey]) {
        performanceMap[userKey] = {
          _id: userKey,
          totalDeals: 0,
          revenue: 0,
        };
      }

      performanceMap[userKey].totalDeals += 1;
      performanceMap[userKey].revenue += deal.value || 0;
    });

    const performance = Object.values(performanceMap);

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