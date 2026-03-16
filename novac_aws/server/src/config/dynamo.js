require("dotenv").config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION || "eu-north-1";

console.log("[DynamoDB] Region:", region);
console.log("[DynamoDB] Access Key ID:", accessKeyId ? accessKeyId.substring(0, 8) + "..." : "MISSING");
console.log("[DynamoDB] Secret Key:", secretAccessKey ? "SET" : "MISSING");

if (!accessKeyId || !secretAccessKey) {
  throw new Error("AWS credentials are missing! Check your .env file.");
}

const client = new DynamoDBClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const dynamoDB = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

module.exports = dynamoDB;
