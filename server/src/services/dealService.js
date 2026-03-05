const dynamoDB = require("../config/dynamo");
const {
  PutCommand,
  QueryCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const TABLE_NAME = "Novac";

/**
 * 🔹 Create Deal
 */
exports.createDeal = async (data, userId) => {
  const dealId = uuidv4();

  const item = {
    PK: `DEAL#${dealId}`,
    SK: "METADATA",
    entity: "DEAL",

    id: dealId,
    title: data.title,
    value: data.value,
    stage: data.stage || "prospect",
    status: data.status || "open",
    expectedClosedDate: data.expectedClosedDate || null,

    lead: `LEAD#${data.lead}`,
    assignedTo: data.assignedTo ? `USER#${data.assignedTo}` : null,
    createdBy: `USER#${userId}`,

    GSI2PK: data.assignedTo ? `USER#${data.assignedTo}` : null,
    GSI2SK: `DEAL#${dealId}`,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await dynamoDB.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  );

  return item;
};

/**
 * 🔹 Get Deals (Role Based)
 */
exports.getDeals = async (user) => {
  if (user.role === "admin") {
    const result = await dynamoDB.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "entity = :entity",
        ExpressionAttributeValues: {
          ":entity": "DEAL",
        },
      })
    );
    return result.Items;
  }

  const result = await dynamoDB.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "GSI2",
      KeyConditionExpression: "GSI2PK = :user",
      ExpressionAttributeValues: {
        ":user": `USER#${user.id}`,
      },
    })
  );

  return result.Items;
};

/**
 * 🔹 Get Deal By ID
 */
exports.getDealById = async (id) => {
  const result = await dynamoDB.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `DEAL#${id}`,
        SK: "METADATA",
      },
    })
  );

  return result.Item;
};

/**
 * 🔹 Update Deal
 */
exports.updateDeal = async (id, updates) => {
  const updateExpressions = [];
  const expressionValues = {};
  const expressionNames = {};

  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined) {
      updateExpressions.push(`#${key} = :${key}`);
      expressionValues[`:${key}`] = updates[key];
      expressionNames[`#${key}`] = key;
    }
  });

  updateExpressions.push("#updatedAt = :updatedAt");
  expressionValues[":updatedAt"] = new Date().toISOString();
  expressionNames["#updatedAt"] = "updatedAt";

  const result = await dynamoDB.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `DEAL#${id}`,
        SK: "METADATA",
      },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
      ReturnValues: "ALL_NEW",
    })
  );

  return result.Attributes;
};

/**
 * 🔹 Delete Deal
 */
exports.deleteDeal = async (id) => {
  await dynamoDB.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `DEAL#${id}`,
        SK: "METADATA",
      },
    })
  );
};