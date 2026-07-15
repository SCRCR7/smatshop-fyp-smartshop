const express = require('express');
const router = express.Router();
const multer = require('multer');
const { handleVoiceCommand, handleAnalyzeText } = require('../controllers/voiceController');

// Multer Config (Temp Storage)
const upload = multer({ dest: 'uploads/' });

router.post('/command', upload.single('audio'), handleVoiceCommand);
router.post('/analyze', handleAnalyzeText);

module.exports = router;
