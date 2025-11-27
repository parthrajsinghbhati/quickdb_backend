const express = require('express');
const apiKeyController = require('../controllers/apiKeyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', apiKeyController.generateApiKey);
router.get('/', apiKeyController.getApiKeys);
router.delete('/:id', apiKeyController.revokeApiKey);

module.exports = router;
