const express = require('express');
const { body } = require('express-validator');
const databaseController = require('../controllers/databaseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/',
  [
    body('name').notEmpty().trim().withMessage('Database name is required')
  ],
  databaseController.createDatabase
);

router.get('/', databaseController.getDatabases);
router.get('/:id', databaseController.getDatabaseById);
router.delete('/:id', databaseController.deleteDatabase);

module.exports = router;
