const dynamoDB = require('../config/dynamo');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { callNova } = require('./novaClient');
const { tryParseJson } = require('./aiParser');
const {
  buildLeadAnalysisPrompt,
  buildEmailPrompt,
  buildNotesSummaryPrompt,
  buildChatPrompt,
} = require('./promptBuilder');
const leadService = require('../services/leadService');
const noteService = require('../services/noteService');
const userService = require('../services/userService');

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'Novac';

async function getRelatedActivitiesForLead(leadId) {
  const result = await dynamoDB.send(new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: 'entity = :entity AND relatedId = :relatedId',
    ExpressionAttributeValues: {
      ':entity': 'ACTIVITY',
      ':relatedId': `LEAD#${leadId}`,
    },
  }));

  return (result.Items || []).map((item) => ({
    title: item.title,
    type: item.type,
    status: item.status,
    dueDate: item.dueDate,
    description: item.description,
    createdAt: item.createdAt,
  }));
}

async function getAssignedUserName(assignedTo) {
  if (!assignedTo || typeof assignedTo !== 'string' || !assignedTo.startsWith('USER#')) {
    return null;
  }

  const userId = assignedTo.replace('USER#', '');
  const user = await userService.getUserById(userId);
  return user?.name || null;
}

async function buildLeadContext({ leadId, lead }) {
  let baseLead = lead;
  if (!baseLead && leadId) {
    baseLead = await leadService.getLeadById(leadId);
  }

  if (!baseLead) {
    throw new Error('Lead not found');
  }

  const [notes, activities, assignedUserName] = await Promise.all([
    noteService.getNotesByRelated(baseLead.id),
    getRelatedActivitiesForLead(baseLead.id),
    getAssignedUserName(baseLead.assignedTo),
  ]);

  return {
    id: baseLead.id,
    name: baseLead.name,
    company: baseLead.company,
    email: baseLead.email,
    phone: baseLead.phone,
    status: baseLead.status,
    notes: baseLead.notes || '',
    assignedTo: assignedUserName || baseLead.assignedTo || 'Unassigned',
    recentActivities: activities.slice(0, 8),
    relatedNotes: (notes || []).slice(0, 8).map((note) => ({
      content: note.content,
      createdAt: note.createdAt,
    })),
  };
}

function normalizeLeadAnalysis(parsed, rawText) {
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return {
      score: Number(parsed.score ?? 0),
      priority: parsed.priority || 'Medium',
      recommendedAction: parsed.recommendedAction || parsed.nextAction || 'Review lead manually',
      reasoning: parsed.reasoning || 'No reasoning returned.',
      followUpMessage: parsed.followUpMessage || 'Follow up with the lead soon.',
      rawText,
    };
  }

  return {
    score: 0,
    priority: 'Unknown',
    recommendedAction: 'Review lead manually',
    reasoning: rawText || 'No response returned from the model.',
    followUpMessage: 'Follow up with the lead soon.',
    rawText,
  };
}

function normalizeEmail(parsed, rawText) {
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return {
      subject: parsed.subject || 'Follow-up from NovaCRM',
      body: parsed.body || rawText || '',
      rawText,
    };
  }

  return {
    subject: 'Follow-up from NovaCRM',
    body: rawText || '',
    rawText,
  };
}

function normalizeSummary(parsed, rawText) {
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return {
      summary: parsed.summary || 'No summary returned.',
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
      nextStep: parsed.nextStep || 'Review manually.',
      rawText,
    };
  }

  return {
    summary: rawText || 'No summary returned.',
    actionItems: [],
    concerns: [],
    nextStep: 'Review manually.',
    rawText,
  };
}

function normalizeChat(parsed, rawText) {
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return {
      answer: parsed.answer || rawText || 'No answer returned.',
      recommendedActions: Array.isArray(parsed.recommendedActions) ? parsed.recommendedActions : [],
      confidence: parsed.confidence || 'medium',
      rawText,
    };
  }

  return {
    answer: rawText || 'No answer returned.',
    recommendedActions: [],
    confidence: 'low',
    rawText,
  };
}

async function generateLeadAnalysis(payload) {
  const context = await buildLeadContext(payload || {});
  const { systemPrompt, userPrompt } = buildLeadAnalysisPrompt(context);
  const rawText = await callNova({
    modelId: process.env.BEDROCK_MODEL_ID || 'amazon.nova-lite-v1:0',
    systemPrompt,
    userPrompt,
  });

  return {
    lead: context,
    analysis: normalizeLeadAnalysis(tryParseJson(rawText), rawText),
  };
}

async function generateEmail(payload) {
  const leadContext = payload?.leadId
    ? await buildLeadContext({ leadId: payload.leadId })
    : (payload?.lead || {});

  const promptPayload = {
    leadName: leadContext.name || payload?.leadName || '',
    company: leadContext.company || payload?.company || '',
    email: leadContext.email || payload?.email || '',
    phone: leadContext.phone || payload?.phone || '',
    goal: payload?.goal || 'schedule next sales step',
    tone: payload?.tone || 'professional and warm',
    context: payload?.context || leadContext.notes || '',
    status: leadContext.status || payload?.status || '',
  };

  const { systemPrompt, userPrompt } = buildEmailPrompt(promptPayload);
  const rawText = await callNova({
    modelId: process.env.BEDROCK_MODEL_ID || 'amazon.nova-lite-v1:0',
    systemPrompt,
    userPrompt,
  });

  return {
    lead: leadContext,
    emailDraft: normalizeEmail(tryParseJson(rawText), rawText),
  };
}

async function summarizeNotes(payload) {
  let noteText = payload?.rawNotes || payload?.notes || '';

  if (!noteText && payload?.leadId) {
    const context = await buildLeadContext({ leadId: payload.leadId });
    noteText = [context.notes, ...(context.relatedNotes || []).map((item) => item.content)].filter(Boolean).join('\n\n');
  }

  if (!noteText) {
    throw new Error('No notes provided to summarize');
  }

  const { systemPrompt, userPrompt } = buildNotesSummaryPrompt({ rawNotes: noteText });
  const rawText = await callNova({
    modelId: process.env.BEDROCK_MODEL_ID || 'amazon.nova-lite-v1:0', // nova-micro needs inference profile, not supported on-demand
    systemPrompt,
    userPrompt,
    maxTokens: 500,
    temperature: 0.3,
  });

  return normalizeSummary(tryParseJson(rawText), rawText);
}

async function buildScopedSnapshot(user, payloadSnapshot) {
  if (payloadSnapshot && Object.keys(payloadSnapshot).length > 0) {
    return payloadSnapshot;
  }

  const result = await dynamoDB.send(new ScanCommand({ TableName: TABLE_NAME }));
  const items = result.Items || [];

  const leads = items.filter((item) => item.entity === 'LEAD');
  const deals = items.filter((item) => item.entity === 'DEAL');
  const activities = items.filter((item) => item.entity === 'ACTIVITY');

  let scopedLeads = leads;
  let scopedDeals = deals;
  let scopedActivities = activities;

  if (user?.role === 'manager') {
    scopedLeads = leads.filter((item) => item.manager === `USER#${user.id}`);
    const scopedLeadKeys = new Set(scopedLeads.map((item) => `LEAD#${item.id}`));
    scopedDeals = deals.filter((item) => item.assignedTo === `USER#${user.id}` || scopedLeadKeys.has(item.lead));
    scopedActivities = activities.filter((item) => item.assignedTo === `USER#${user.id}` || scopedLeadKeys.has(item.relatedId));
  } else if (user?.role === 'employee') {
    scopedLeads = leads.filter((item) => item.assignedTo === `USER#${user.id}`);
    scopedDeals = deals.filter((item) => item.assignedTo === `USER#${user.id}`);
    scopedActivities = activities.filter((item) => item.assignedTo === `USER#${user.id}`);
  }

  return {
    summary: {
      leadCount: scopedLeads.length,
      dealCount: scopedDeals.length,
      activityCount: scopedActivities.length,
      convertedLeadCount: scopedLeads.filter((item) => item.status === 'converted').length,
      inProgressLeadCount: scopedLeads.filter((item) => item.status === 'in-progress').length,
      openDealValue: scopedDeals
        .filter((item) => item.status !== 'closed')
        .reduce((sum, item) => sum + Number(item.value || 0), 0),
    },
    leads: scopedLeads.slice(0, 20).map((item) => ({
      id: item.id,
      name: item.name,
      company: item.company,
      status: item.status,
      notes: item.notes,
      assignedTo: item.assignedTo,
      createdAt: item.createdAt,
    })),
    deals: scopedDeals.slice(0, 20).map((item) => ({
      id: item.id,
      title: item.title,
      value: item.value,
      stage: item.stage,
      status: item.status,
      assignedTo: item.assignedTo,
      expectedClosedDate: item.expectedClosedDate,
    })),
    activities: scopedActivities.slice(0, 20).map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      status: item.status,
      dueDate: item.dueDate,
      assignedTo: item.assignedTo,
      relatedId: item.relatedId,
    })),
  };
}

async function answerCRMQuestion(payload, user) {
  if (!payload?.question) {
    throw new Error('Question is required');
  }

  const snapshot = await buildScopedSnapshot(user, payload.snapshot || {});
  const { systemPrompt, userPrompt } = buildChatPrompt({
    question: payload.question,
    snapshot,
  });

  const rawText = await callNova({
    modelId: process.env.BEDROCK_MODEL_ID || 'amazon.nova-lite-v1:0',
    systemPrompt,
    userPrompt,
    maxTokens: 650,
    temperature: 0.3,
  });

  return {
    snapshot,
    response: normalizeChat(tryParseJson(rawText), rawText),
  };
}

module.exports = {
  generateLeadAnalysis,
  generateEmail,
  summarizeNotes,
  answerCRMQuestion,
};
