const Movement = require('../models/Movement');

// Create a new movement
exports.createMovement = async (req, res) => {
  try {
    const movement = new Movement({
      ...req.body,
      clientId: req.body.id // Store the client-generated ID
    });
    await movement.save();
    res.status(201).json(movement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get movements by SE number
exports.getMovementsBySE = async (req, res) => {
  try {
    const movements = await Movement.find({ 
      seNumber: req.params.seNumber.toUpperCase() 
    }).sort({ timestamp: -1 });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all movements (with pagination)
exports.getAllMovements = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const movements = await Movement.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Movement.countDocuments();

    res.json({
      movements,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMovements: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sync multiple movements
exports.syncMovements = async (req, res) => {
  try {
    const movements = req.body;
    if (!Array.isArray(movements)) {
      return res.status(400).json({ message: 'Expected an array of movements' });
    }

    const results = await Promise.all(
      movements.map(async (movement) => {
        try {
          const existingMovement = await Movement.findOne({ clientId: movement.id });
          if (existingMovement) {
            return { id: movement.id, status: 'already_synced' };
          }

          const newMovement = new Movement({
            ...movement,
            clientId: movement.id
          });
          await newMovement.save();
          return { id: movement.id, status: 'synced' };
        } catch (error) {
          return { id: movement.id, status: 'failed', error: error.message };
        }
      })
    );

    res.json({
      success: true,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sync status
exports.getSyncStatus = async (req, res) => {
  try {
    const clientIds = req.body.ids;
    if (!Array.isArray(clientIds)) {
      return res.status(400).json({ message: 'Expected an array of IDs' });
    }

    const syncedMovements = await Movement.find({
      clientId: { $in: clientIds }
    }).select('clientId');

    const syncedIds = syncedMovements.map(m => m.clientId);

    res.json({
      synced: syncedIds,
      pending: clientIds.filter(id => !syncedIds.includes(id))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};