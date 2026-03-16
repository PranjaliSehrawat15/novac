const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');

const region = process.env.AWS_REGION || 'eu-north-1';

const client = new BedrockRuntimeClient({
  region,
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
});

async function callNova({
  modelId,
  systemPrompt,
  userPrompt,
  maxTokens = 700,
  temperature = 0.4,
  topP = 0.9,
}) {
  const command = new ConverseCommand({
    modelId: modelId || process.env.BEDROCK_MODEL_ID || 'amazon.nova-lite-v1:0',
    system: systemPrompt ? [{ text: systemPrompt }] : undefined,
    messages: [
      {
        role: 'user',
        content: [{ text: userPrompt }],
      },
    ],
    inferenceConfig: {
      maxTokens,
      temperature,
      topP,
    },
  });

  const response = await client.send(command);
  return response?.output?.message?.content?.[0]?.text || '';
}

module.exports = { callNova };
