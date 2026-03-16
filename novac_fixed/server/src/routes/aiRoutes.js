const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const aiController = require('../controllers/aiController');

router.use(protect);

router.post('/lead-analysis', aiController.leadAnalysis);
router.post('/generate-email', aiController.generateEmail);
router.post('/summarize-notes', aiController.summarizeNotes);
router.post('/chat', aiController.chatAssistant);

module.exports = router;
