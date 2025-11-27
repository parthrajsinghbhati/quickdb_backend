const express = require('express');
const { body } = require('express-validator');
const tableController = require('../controllers/tableController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/',
  [
    body('name').notEmpty().trim().withMessage('Table name is required'),
    body('databaseId').isInt().withMessage('Valid database ID is required'),
    body('columns').isObject().withMessage('Columns definition is required')
  ],
  tableController.createTable
);

router.get('/', tableController.getTables);
router.get('/:id', tableController.getTableById);
router.delete('/:id', tableController.deleteTable);

module.exports = router;
