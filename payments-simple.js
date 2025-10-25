const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect } = require('../middleware/auth');

router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = db.bookings.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Simulate payment intent
    const paymentIntentId = 'pi_' + Date.now();
    
    res.json({
      success: true,
      clientSecret: paymentIntentId + '_secret',
      paymentIntentId: paymentIntentId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.post('/confirm', protect, async (req, res) => {
  try {
    const { bookingId, transactionId, paymentMethod } = req.body;
    const booking = db.bookings.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const payment = db.payments.create({
      booking: bookingId,
      user: req.user._id,
      amount: booking.totalAmount,
      currency: 'INR',
      paymentMethod,
      paymentGateway: 'stripe',
      transactionId,
      status: 'success'
    });

    db.bookings.update(bookingId, {
      paymentStatus: 'paid',
      paymentId: payment._id,
      status: 'confirmed'
    });

    res.json({ success: true, payment, booking: db.bookings.findById(bookingId) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.post('/refund', protect, async (req, res) => {
  try {
    const { bookingId, reason } = req.body;
    const booking = db.bookings.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.paymentStatus !== 'paid') {
      return res.status(400).json({ success: false, message: 'No payment to refund' });
    }

    const payment = db.payments.findById(booking.paymentId);
    if (payment) {
      db.payments.update(payment._id, {
        status: 'refunded',
        refundAmount: booking.totalAmount,
        refundReason: reason
      });
    }

    db.bookings.update(bookingId, { paymentStatus: 'refunded' });

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund: { amount: booking.totalAmount, status: 'refunded' }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    let payments = db.payments.findAll();
    
    if (req.user.role !== 'admin') {
      payments = payments.filter(p => p.user === req.user._id);
    }

    res.json({ success: true, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
