const express = require('express');
const router = express.Router();
const movementController = require('../controllers/movementController');

// GET all movements (paginated)
router.get('/movements', movementController.getAllMovements);

// GET movements by SE number
router.get('/movements/se/:seNumber', movementController.getMovementsBySE);

// POST new movement
router.post('/movements', movementController.createMovement);

// POST sync multiple movements
router.post('/movements/sync', movementController.syncMovements);

// POST check sync status
router.post('/movements/sync-status', movementController.getSyncStatus);

module.exports = router;