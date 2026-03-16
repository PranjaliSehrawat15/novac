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

const TABLE_NAME = process.env.DYNAMODB_TABLE || "Novac";

/**
 * 🔹 Create Lead
 */
exports.createLead = async (data) => {
  const leadId = uuidv4();

  const item = {
    PK: `LEAD#${leadId}`,
    SK: "METADATA",
    entity: "LEAD",

    id: leadId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    status: data.status || "new",

    manager: data.manager ? `USER#${data.manager}` : null,
    assignedTo: data.assignedTo ? `USER#${data.assignedTo}` : null,

    notes: data.notes || "",

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // ✅ Only add GSI2 keys if assignedTo exists
  if (data.assignedTo) {
    item.GSI2PK = `USER#${data.assignedTo}`;
    item.GSI2SK = `LEAD#${leadId}`;
  }

  await dynamoDB.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  );

  return item;
};

/**
 * 🔹 Get Leads (Role Based)
 */
exports.getLeads = async (user) => {
  // 🔴 Admin → See all leads
  if (user.role === "admin") {
    const result = await dynamoDB.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "entity = :entity",
        ExpressionAttributeValues: {
          ":entity": "LEAD",
        },
      })
    );
    return result.Items;
  }

  // 🟡 Manager → Leads where manager = USER#id
  if (user.role === "manager") {
    const result = await dynamoDB.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "entity = :entity AND manager = :manager",
        ExpressionAttributeValues: {
          ":entity": "LEAD",
          ":manager": `USER#${user.id}`,
        },
      })
    );
    return result.Items;
  }

  // 🔵 Employee → Leads assigned to them (via GSI2)
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
 * 🔹 Get Lead By ID
 */
exports.getLeadById = async (id) => {
  const result = await dynamoDB.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `LEAD#${id}`,
        SK: "METADATA",
      },
    })
  );
  return result.Item;
};

/**
 * 🔹 Update Lead
 */
exports.updateLead = async (lead, updates, user) => {
  let allowedUpdates = {};

  if (user.role === "admin") {
    allowedUpdates = updates;
  } else if (user.role === "manager") {
    if (lead.manager !== `USER#${user.id}`) {
      throw new Error("Not authorized to update this lead");
    }
    allowedUpdates = updates;
  } else {
    if (lead.assignedTo !== `USER#${user.id}`) {
      throw new Error("Not authorized to update this lead");
    }

    allowedUpdates = {
      status: updates.status,
      notes: updates.notes,
    };
  }

  const updateExpressions = [];
  const expressionValues = {};
  const expressionNames = {};

  Object.keys(allowedUpdates).forEach((key) => {
    if (allowedUpdates[key] !== undefined) {
      updateExpressions.push(`#${key} = :${key}`);
      expressionValues[`:${key}`] = allowedUpdates[key];
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
        PK: lead.PK,
        SK: lead.SK,
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
 * 🔹 Delete Lead
 */
exports.deleteLead = async (id) => {
  await dynamoDB.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `LEAD#${id}`,
        SK: "METADATA",
      },
    })
  );
};