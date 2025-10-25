const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Bike = require('../models/Bike');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/bookings
// @desc    Get all bookings (admin) or user's bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('bike', 'name brand model image pricePerDay pricePerHour')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('bike', 'name brand model image pricePerDay pricePerHour registrationNumber')
      .populate('user', 'name email phone licenseNumber');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { bikeId, startDate, endDate, rentalType, duration, pickupLocation } = req.body;

    // Check if bike exists and is available
    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return res.status(404).json({
        success: false,
        message: 'Bike not found'
      });
    }

    if (!bike.available) {
      return res.status(400).json({
        success: false,
        message: 'Bike is not available'
      });
    }

    // Calculate total amount
    const price = rentalType === 'hourly' ? bike.pricePerHour : bike.pricePerDay;
    const totalAmount = price * duration;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      bike: bikeId,
      startDate,
      endDate,
      rentalType,
      duration,
      totalAmount,
      pickupLocation,
      currentLocation: bike.location
    });

    // Update bike availability
    bike.available = false;
    await bike.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('bike', 'name brand model image pricePerDay pricePerHour')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      booking: populatedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${booking.status} booking`
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'User cancelled';
    booking.cancelledAt = new Date();
    await booking.save();

    // Make bike available again
    const bike = await Bike.findById(booking.bike);
    if (bike) {
      bike.available = true;
      await bike.save();
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/bookings/:id/location
// @desc    Update booking location (for live tracking)
// @access  Private
router.put('/:id/location', protect, async (req, res) => {
  try {
    const { coordinates, address } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.currentLocation = {
      type: 'Point',
      coordinates,
      lastUpdated: new Date()
    };

    if (address) {
      booking.currentLocation.address = address;
    }

    await booking.save();

    // Emit location update via Socket.IO
    const io = req.app.get('io');
    io.to(`booking-${booking._id}`).emit('locationUpdate', {
      bookingId: booking._id,
      location: booking.currentLocation
    });

    res.json({
      success: true,
      location: booking.currentLocation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    await booking.save();

    // If booking is completed, make bike available
    if (status === 'completed') {
      const bike = await Bike.findById(booking.bike);
      if (bike) {
        bike.available = true;
        bike.totalRides += 1;
        await bike.save();
      }
    }

    res.json({
      success: true,
      booking
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
