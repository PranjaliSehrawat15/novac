const dynamoDB = require("../config/dynamo");
const {
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const TABLE_NAME = "Novac";

/**
 * 🔹 Create New User
 */
exports.createUser = async (userData) => {
  const userId = uuidv4();
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const role = userData.role || "employee";

  const item = {
    PK: `USER#${userId}`,
    SK: `PROFILE#${userId}`, // ⚠️ changed from "METADATA" to "PROFILE#id"    
    entity: "USER",

    id: userId,
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: role,
    isActive: true,

    // GSI1 → Role query
    GSI1PK: `ROLE#${role}`,
    GSI1SK: `USER#${userId}`,

    // GSI3 → Email query
    GSI3PK: `EMAIL#${userData.email}`,
    GSI3SK: `USER#${userId}`,

    createdAt: new Date().toISOString(),
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
 * 🔹 Get All Users (Admin use)
 */
exports.getAllUsers = async () => {
  const result = await dynamoDB.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "entity = :entity",
      ExpressionAttributeValues: {
        ":entity": "USER",
      },
    })
  );

  const users = result.Items || [];

  return users.map((user) => {
    delete user.password;
    return user;
  });
};

/**
 * 🔹 Get User By ID
 */
exports.getUserById = async (id) => {
  const result = await dynamoDB.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${id}`,
        SK: `PROFILE#${id}`,
      },
    })
  );

  return result.Item;
};

/**
 * 🔹 Get User By Email (Login)
 */
exports.getUserByEmail = async (email) => {
  const result = await dynamoDB.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "GSI3PK-GSI3SK-index",
      KeyConditionExpression: "GSI3PK = :email",
      ExpressionAttributeValues: {
        ":email": `EMAIL#${email}`,
      },
    })
  );

  if (!result.Items || result.Items.length === 0) {
    return null;
  }

  return result.Items[0];
};

/**
 * 🔹 Update User Role
 */
exports.updateUserRole = async (userId, newRole) => {
  const result = await dynamoDB.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `PROFILE#${userId}`,
      },
      UpdateExpression: `
        SET #role = :role,
            GSI1PK = :gsi1pk
      `,
      ExpressionAttributeNames: {
        "#role": "role",
      },
      ExpressionAttributeValues: {
        ":role": newRole,
        ":gsi1pk": `ROLE#${newRole}`,
      },
      ReturnValues: "ALL_NEW",
    })
  );

  if (result.Attributes) {
    delete result.Attributes.password;
  }

  return result.Attributes;
};

/**
 * 🔹 Activate / Deactivate User
 */
exports.toggleUserStatus = async (userId, isActive) => {
  const result = await dynamoDB.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `PROFILE#${userId}`,
      },
      UpdateExpression: "SET isActive = :isActive",
      ExpressionAttributeValues: {
        ":isActive": isActive,
      },
      ReturnValues: "ALL_NEW",
    })
  );

  if (result.Attributes) {
    delete result.Attributes.password;
  }

  return result.Attributes;
};

/**
 * 🔹 Compare Password
 */
exports.comparePassword = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

/**
 * 🔹 Update Password
 */
exports.updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await dynamoDB.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `PROFILE#${userId}`,
      },
      UpdateExpression: "SET #password = :password",
      ExpressionAttributeNames: {
        "#password": "password",
      },
      ExpressionAttributeValues: {
        ":password": hashedPassword,
      },
    })
  );
};