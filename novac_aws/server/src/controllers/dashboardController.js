const dynamoDB = require("../config/dynamo");
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.DYNAMODB_TABLE || "Novac";

function scopeItems(items, user) {
  const leads = items.filter((i) => i.entity === "LEAD");
  const deals = items.filter((i) => i.entity === "DEAL");

  if (user.role === "admin") return { leads, deals };

  if (user.role === "manager") {
    const scopedLeads = leads.filter(
      (l) => l.manager === `USER#${user.id}` || l.assignedTo === `USER#${user.id}`
    );
    const scopedLeadKeys = new Set(scopedLeads.map((l) => `LEAD#${l.id}`));
    const scopedDeals = deals.filter(
      (d) => d.assignedTo === `USER#${user.id}` || scopedLeadKeys.has(d.lead)
    );
    return { leads: scopedLeads, deals: scopedDeals };
  }

  // employee
  return {
    leads: leads.filter((l) => l.assignedTo === `USER#${user.id}`),
    deals: deals.filter((d) => d.assignedTo === `USER#${user.id}`),
  };
}

exports.getSummary = async (req, res) => {
  try {
    const result = await dynamoDB.send(new ScanCommand({ TableName: TABLE_NAME }));
    const items = result.Items || [];
    const { leads, deals } = scopeItems(items, req.user);

    const closedWonDeals = deals.filter((d) => d.stage === "Closed Won").length;
    const closedLostDeals = deals.filter((d) => d.stage === "Closed Lost").length;
    const totalRevenue = deals
      .filter((d) => d.stage === "Closed Won")
      .reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    const pipelineValue = deals
      .filter((d) => d.stage !== "Closed Lost")
      .reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    const closedTotal = closedWonDeals + closedLostDeals;
    const winRate = closedTotal > 0 ? Math.round((closedWonDeals / closedTotal) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalLeads: leads.length,
        totalDeals: deals.length,
        closedWonDeals,
        closedLostDeals,
        totalRevenue,
        pipelineValue,
        winRate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPipeline = async (req, res) => {
  try {
    const result = await dynamoDB.send(new ScanCommand({ TableName: TABLE_NAME }));
    const { deals } = scopeItems(result.Items || [], req.user);

    const STAGE_ORDER = ["Prospect","Proposal","Negotiation","Closed Won","Closed Lost"];
    const pipelineMap = {};

    deals.forEach((deal) => {
      const stage = deal.stage || "Unknown";
      if (!pipelineMap[stage]) pipelineMap[stage] = { _id: stage, count: 0, revenue: 0 };
      pipelineMap[stage].count += 1;
      pipelineMap[stage].revenue += Number(deal.value) || 0;
    });

    const pipeline = STAGE_ORDER.filter((s) => pipelineMap[s]).map((s) => pipelineMap[s]);
    Object.keys(pipelineMap).forEach((s) => { if (!STAGE_ORDER.includes(s)) pipeline.push(pipelineMap[s]); });

    res.status(200).json({ success: true, data: pipeline });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPerformance = async (req, res) => {
  try {
    const result = await dynamoDB.send(new ScanCommand({ TableName: TABLE_NAME }));
    const { deals } = scopeItems(result.Items || [], req.user);

    const performanceMap = {};
    deals.forEach((deal) => {
      const userKey = deal.assignedTo || "Unassigned";
      if (!performanceMap[userKey]) performanceMap[userKey] = { _id: userKey, totalDeals: 0, closedWon: 0, revenue: 0 };
      performanceMap[userKey].totalDeals += 1;
      performanceMap[userKey].revenue += Number(deal.value) || 0;
      if (deal.stage === "Closed Won") performanceMap[userKey].closedWon += 1;
    });

    res.status(200).json({ success: true, data: Object.values(performanceMap) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
