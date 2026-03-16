function toPrettyJson(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch (error) {
    return String(value || '');
  }
}

function buildLeadAnalysisPrompt(payload) {
  return {
    systemPrompt: [
      'You are an expert CRM sales assistant.',
      'Analyze CRM lead data and return JSON only.',
      'Be concise, practical, and business-oriented.',
      'Do not include markdown fences or any text outside JSON.'
    ].join(' '),
    userPrompt: [
      'Analyze this lead and return JSON with:',
      '{',
      '  "score": number from 0 to 100,',
      '  "priority": short string,',
      '  "recommendedAction": short string,',
      '  "reasoning": short paragraph,',
      '  "followUpMessage": short string',
      '}',
      '',
      'Lead Data:',
      toPrettyJson(payload),
    ].join('\n'),
  };
}

function buildEmailPrompt(payload) {
  return {
    systemPrompt: [
      'You are a B2B sales email assistant.',
      'Write a professional, personalized follow-up email.',
      'Return JSON only with keys "subject" and "body".',
      'Do not include markdown fences or extra commentary.'
    ].join(' '),
    userPrompt: [
      'Write a follow-up sales email using this CRM context:',
      toPrettyJson(payload),
    ].join('\n\n'),
  };
}

function buildNotesSummaryPrompt(payload) {
  return {
    systemPrompt: [
      'You summarize meeting notes for CRM systems.',
      'Return JSON only with keys "summary", "actionItems", "concerns", and "nextStep".',
      '"actionItems" and "concerns" must be arrays of short strings.',
      'Do not include markdown fences or extra commentary.'
    ].join(' '),
    userPrompt: [
      'Summarize these CRM notes:',
      toPrettyJson(payload),
    ].join('\n\n'),
  };
}

function buildChatPrompt(payload) {
  return {
    systemPrompt: [
      'You are an AI sales assistant inside a CRM.',
      'Answer only from the provided CRM data.',
      'If the answer is not supported by the data, clearly say the data is insufficient.',
      'Return JSON only with keys "answer", "recommendedActions", and "confidence".',
      '"recommendedActions" must be an array of short strings.',
      'Do not include markdown fences or extra commentary.'
    ].join(' '),
    userPrompt: [
      `Question: ${payload.question || ''}`,
      '',
      'CRM Snapshot:',
      toPrettyJson(payload.snapshot || {}),
    ].join('\n'),
  };
}

module.exports = {
  buildLeadAnalysisPrompt,
  buildEmailPrompt,
  buildNotesSummaryPrompt,
  buildChatPrompt,
};
