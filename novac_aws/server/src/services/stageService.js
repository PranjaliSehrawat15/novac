const dynamoDB = require("../config/dynamo");
const {
  PutCommand,
  ScanCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const TABLE_NAME = process.env.DYNAMODB_TABLE || "Novac";

/**
 * 🔹 Create Stage
 */
exports.createStage = async (data, userId) => {
  // Check uniqueness of stage name (manual since no unique constraint)
  const existingStages = await dynamoDB.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "entity = :entity AND #name = :name",
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":entity": "STAGE",
        ":name": data.name,
      },
    })
  );

  if (existingStages.Items.length > 0) {
    throw new Error("Stage name must be unique");
  }

  const stageId = uuidv4();

  const item = {
    PK: `STAGE#${stageId}`,
    SK: "METADATA",
    entity: "STAGE",

    id: stageId,
    name: data.name,
    order: data.order,
    probability: data.probability || 0,
    isClosed: data.isClosed || false,

    createdBy: `USER#${userId}`,

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
 * 🔹 Get All Stages (sorted by order)
 */
exports.getStages = async () => {
  const result = await dynamoDB.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "entity = :entity",
      ExpressionAttributeValues: {
        ":entity": "STAGE",
      },
    })
  );

  // Sort manually
  return result.Items.sort((a, b) => a.order - b.order);
};

/**
 * 🔹 Get Stage By ID
 */
exports.getStageById = async (id) => {
  const result = await dynamoDB.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `STAGE#${id}`,
        SK: "METADATA",
      },
    })
  );

  return result.Item;
};

/**
 * 🔹 Update Stage
 */
exports.updateStage = async (id, updates) => {
  const updateExpressions = [];
  const expressionValues = {};
  const expressionNames = {};

  Object.keys(updates).forEach((key) => {
    updateExpressions.push(`#${key} = :${key}`);
    expressionValues[`:${key}`] = updates[key];
    expressionNames[`#${key}`] = key;
  });

  updateExpressions.push("#updatedAt = :updatedAt");
  expressionValues[":updatedAt"] = new Date().toISOString();
  expressionNames["#updatedAt"] = "updatedAt";

  const result = await dynamoDB.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `STAGE#${id}`,
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
 * 🔹 Delete Stage
 */
exports.deleteStage = async (id) => {
  await dynamoDB.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `STAGE#${id}`,
        SK: "METADATA",
      },
    })
  );
};