const dynamoDB = require("../config/dynamo");
const {
  PutCommand,
  QueryCommand,
  GetCommand,
  UpdateCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const TABLE_NAME = "Novac";

/**
 * 🔹 Create Activity
 */
exports.createActivity = async (data, creatorId) => {
  const activityId = uuidv4();

  const relatedFormatted =
    data.relatedTo === "lead"
      ? `LEAD#${data.relatedId}`
      : `DEAL#${data.relatedId}`;

  const item = {
    PK: `ACTIVITY#${activityId}`,
    SK: "METADATA",
    entity: "ACTIVITY",

    id: activityId,
    title: data.title,
    type: data.type,
    description: data.description || "",

    relatedTo: data.relatedTo,
    relatedId: relatedFormatted,

    dueDate: data.dueDate || null,
    status: data.status || "pending",

    createdBy: `USER#${creatorId}`,
    assignedTo: `USER#${data.assignedTo}`,

    GSI2PK: `USER#${data.assignedTo}`,
    GSI2SK: `ACTIVITY#${activityId}`,

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
 * 🔹 Get Activities (Role Based)
 */
exports.getActivities = async (user) => {
  if (user.role === "admin") {
    const result = await dynamoDB.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "entity = :entity",
        ExpressionAttributeValues: {
          ":entity": "ACTIVITY",
        },
      })
    );
    return result.Items;
  }

  const result = await dynamoDB.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "GSI2PK",
      KeyConditionExpression: "GSI2PK = :user",
      ExpressionAttributeValues: {
        ":user": `USER#${user.id}`,
      },
    })
  );

  return result.Items;
};

/**
 * 🔹 Get Activity By ID
 */
exports.getActivityById = async (id) => {
  const result = await dynamoDB.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `ACTIVITY#${id}`,
        SK: "METADATA",
      },
    })
  );

  return result.Item;
};

/**
 * 🔹 Update Activity Status
 */
exports.updateActivityStatus = async (id, status) => {
  const result = await dynamoDB.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `ACTIVITY#${id}`,
        SK: "METADATA",
      },
      UpdateExpression: `
        SET #status = :status,
            #updatedAt = :updatedAt
      `,
      ExpressionAttributeNames: {
        "#status": "status",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":status": status,
        ":updatedAt": new Date().toISOString(),
      },
      ReturnValues: "ALL_NEW",
    })
  );

  return result.Attributes;
};