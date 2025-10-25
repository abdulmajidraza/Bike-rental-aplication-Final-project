const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    let bookings = db.bookings.findAll();
    
    if (req.user.role !== 'admin') {
      bookings = bookings.filter(b => b.user === req.user._id);
    }

    // Populate bike and user data
    bookings = bookings.map(booking => {
      const bike = db.bikes.findById(booking.bike);
      const user = db.users.findById(booking.user);
      return {
        ...booking,
        bike: bike ? { _id: bike._id, name: bike.name, brand: bike.brand, model: bike.model, image: bike.image, pricePerDay: bike.pricePerDay, pricePerHour: bike.pricePerHour } : null,
        user: user ? { _id: user._id, name: user.name, email: user.email, phone: user.phone } : null
      };
    });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const booking = db.bookings.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const bike = db.bikes.findById(booking.bike);
    const user = db.users.findById(booking.user);
    
    res.json({
      success: true,
      booking: {
        ...booking,
        bike: bike ? { ...bike } : null,
        user: user ? { _id: user._id, name: user.name, email: user.email, phone: user.phone, licenseNumber: user.licenseNumber } : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { bikeId, startDate, endDate, rentalType, duration, pickupLocation } = req.body;

    const bike = db.bikes.findById(bikeId);
    if (!bike) {
      return res.status(404).json({ success: false, message: 'Bike not found' });
    }

    if (!bike.available) {
      return res.status(400).json({ success: false, message: 'Bike is not available' });
    }

    const price = rentalType === 'hourly' ? bike.pricePerHour : bike.pricePerDay;
    const rentalAmount = price * duration;
    const securityDeposit = bike.securityDeposit || 0;
    const totalAmount = rentalAmount + securityDeposit;

    const booking = db.bookings.create({
      user: req.user._id,
      bike: bikeId,
      startDate,
      endDate,
      rentalType,
      duration,
      rentalAmount,
      securityDeposit,
      totalAmount,
      pickupLocation,
      currentLocation: bike.location,
      status: 'pending',
      paymentStatus: 'pending'
    });

    db.bikes.update(bikeId, { available: false });

    const populatedBooking = {
      ...booking,
      bike: { _id: bike._id, name: bike.name, brand: bike.brand, model: bike.model, image: bike.image, pricePerDay: bike.pricePerDay, pricePerHour: bike.pricePerHour },
      user: { _id: req.user._id, name: req.user.name, email: req.user.email, phone: req.user.phone }
    };

    res.status(201).json({ success: true, booking: populatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = db.bookings.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status} booking` });
    }

    const updatedBooking = db.bookings.update(req.params.id, {
      status: 'cancelled',
      cancellationReason: req.body.reason || 'User cancelled',
      cancelledAt: new Date().toISOString()
    });

    const bike = db.bikes.findById(booking.bike);
    if (bike) {
      db.bikes.update(booking.bike, { available: true });
    }

    res.json({ success: true, message: 'Booking cancelled successfully', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.put('/:id/location', protect, async (req, res) => {
  try {
    const { coordinates, address } = req.body;
    const booking = db.bookings.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const updatedBooking = db.bookings.update(req.params.id, {
      currentLocation: {
        type: 'Point',
        coordinates,
        address,
        lastUpdated: new Date().toISOString()
      }
    });

    const io = req.app.get('io');
    io.to(`booking-${booking._id}`).emit('locationUpdate', {
      bookingId: booking._id,
      location: updatedBooking.currentLocation
    });

    res.json({ success: true, location: updatedBooking.currentLocation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const booking = db.bookings.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const updatedBooking = db.bookings.update(req.params.id, { status });

    if (status === 'completed') {
      const bike = db.bikes.findById(booking.bike);
      if (bike) {
        db.bikes.update(booking.bike, { 
          available: true,
          totalRides: (bike.totalRides || 0) + 1
        });
      }
    }

    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
