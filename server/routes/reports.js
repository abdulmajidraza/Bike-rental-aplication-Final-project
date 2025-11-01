const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Bike = require('../models/Bike');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/reports/daily
// @desc    Get daily report
// @access  Private/Admin
router.get('/daily', protect, authorize('admin'), async (req, res) => {
  try {
    const { date } = req.query;
    
    const startDate = date ? new Date(date) : new Date();
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    // Get bookings for the day
    const bookings = await Booking.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('bike', 'name brand model').populate('user', 'name email');

    // Get payments for the day
    const payments = await Payment.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: 'success'
    });

    // Calculate statistics
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => b.status === 'active').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
    
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalRefunds = payments
      .filter(p => p.status === 'refunded')
      .reduce((sum, p) => sum + p.refundAmount, 0);

    res.json({
      success: true,
      report: {
        date: startDate,
        bookings: {
          total: totalBookings,
          active: activeBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
          details: bookings
        },
        revenue: {
          total: totalRevenue,
          refunds: totalRefunds,
          net: totalRevenue - totalRefunds
        },
        payments: payments.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/reports/overview
// @desc    Get overall statistics
// @access  Private/Admin
router.get('/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const totalBikes = await Bike.countDocuments();
    const availableBikes = await Bike.countDocuments({ available: true });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'active' });
    
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get bookings by status
    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get popular bikes
    const popularBikes = await Bike.find()
      .sort({ totalRides: -1 })
      .limit(5)
      .select('name brand model totalRides rating');

    res.json({
      success: true,
      overview: {
        bikes: {
          total: totalBikes,
          available: availableBikes,
          inUse: totalBikes - availableBikes
        },
        users: totalUsers,
        bookings: {
          total: totalBookings,
          active: activeBookings,
          byStatus: bookingsByStatus
        },
        revenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        popularBikes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/reports/revenue
// @desc    Get revenue report by date range
// @access  Private/Admin
router.get('/revenue', protect, authorize('admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const revenueByDay = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'success'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          totalRevenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      revenue: revenueByDay
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
