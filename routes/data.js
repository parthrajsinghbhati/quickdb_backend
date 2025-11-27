const express = require('express');
const dataController = require('../controllers/dataController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// CRUD operations for records in a table
router.post('/:tableId/records', dataController.createRecord);
router.get('/:tableId/records', dataController.getRecords);
router.get('/:tableId/records/:id', dataController.getRecordById);
router.put('/:tableId/records/:id', dataController.updateRecord);
router.delete('/:tableId/records/:id', dataController.deleteRecord);

module.exports = router;
