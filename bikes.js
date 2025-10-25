const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/bikes
// @desc    Get all bikes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { brand, available, minPrice, maxPrice } = req.query;
    
    let query = {};
    
    if (brand) {
      query.brand = brand;
    }
    
    if (available !== undefined) {
      query.available = available === 'true';
    }
    
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    let bikes = db.bikes.find(query);
    
    // Apply filters
    if (minPrice || maxPrice) {
      bikes = bikes.filter(bike => {
        if (minPrice && bike.pricePerDay < Number(minPrice)) return false;
        if (maxPrice && bike.pricePerDay > Number(maxPrice)) return false;
        return true;
      });
    }

    res.json({
      success: true,
      count: bikes.length,
      bikes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/bikes/:id
// @desc    Get single bike
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const bike = db.bikes.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: 'Bike not found'
      });
    }

    res.json({
      success: true,
      bike
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/bikes
// @desc    Create a new bike
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const bike = db.bikes.create(req.body);

    res.status(201).json({
      success: true,
      bike
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/bikes/:id
// @desc    Update bike
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const bike = db.bikes.update(req.params.id, req.body);

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: 'Bike not found'
      });
    }

    res.json({
      success: true,
      bike
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/bikes/:id
// @desc    Delete bike
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const bike = db.bikes.delete(req.params.id);

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: 'Bike not found'
      });
    }

    res.json({
      success: true,
      message: 'Bike deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
