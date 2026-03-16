const aiService = require('../ai/aiService');

exports.leadAnalysis = async (req, res) => {
  try {
    const result = await aiService.generateLeadAnalysis(req.body || {});
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('AI leadAnalysis error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateEmail = async (req, res) => {
  try {
    const result = await aiService.generateEmail(req.body || {});
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('AI generateEmail error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.summarizeNotes = async (req, res) => {
  try {
    const result = await aiService.summarizeNotes(req.body || {});
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('AI summarizeNotes error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.chatAssistant = async (req, res) => {
  try {
    const result = await aiService.answerCRMQuestion(req.body || {}, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('AI chatAssistant error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
