const dynamoDB = require("../config/dynamo");
const {
  PutCommand,
  QueryCommand,
  GetCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const TABLE_NAME = process.env.DYNAMODB_TABLE || "Novac";

/**
 * 🔹 Create Note
 */
exports.createNote = async (data, userId) => {
  const noteId = uuidv4();

  const relatedIdFormatted =
    data.relatedTo === "lead"
      ? `LEAD#${data.relatedId}`
      : `DEAL#${data.relatedId}`;

  const item = {
    PK: `NOTE#${noteId}`,
    SK: "METADATA",
    entity: "NOTE",

    id: noteId,
    content: data.content,
    relatedTo: data.relatedTo,
    relatedId: relatedIdFormatted,

    createdBy: `USER#${userId}`,

    // GSI2 → Query notes by related entity
    GSI2PK: relatedIdFormatted,
    GSI2SK: `NOTE#${noteId}`,

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
 * 🔹 Get Notes By Related Entity
 */
exports.getNotesByRelated = async (relatedId) => {
  const leadKey = `LEAD#${relatedId}`;
  const dealKey = `DEAL#${relatedId}`;

  // Try both (since we don't know which type)
  const result = await dynamoDB.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "GSI2",
      KeyConditionExpression: "GSI2PK = :related",
      ExpressionAttributeValues: {
        ":related": leadKey,
      },
    })
  );

  if (result.Items.length > 0) return result.Items;

  const resultDeal = await dynamoDB.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "GSI2",
      KeyConditionExpression: "GSI2PK = :related",
      ExpressionAttributeValues: {
        ":related": dealKey,
      },
    })
  );

  return resultDeal.Items;
};

/**
 * 🔹 Get Note By ID
 */
exports.getNoteById = async (id) => {
  const result = await dynamoDB.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `NOTE#${id}`,
        SK: "METADATA",
      },
    })
  );

  return result.Item;
};

/**
 * 🔹 Delete Note
 */
exports.deleteNote = async (id) => {
  await dynamoDB.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `NOTE#${id}`,
        SK: "METADATA",
      },
    })
  );
};