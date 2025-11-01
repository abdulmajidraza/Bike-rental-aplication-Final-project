const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, authorize } = require('../middleware/auth');

router.get('/daily', protect, authorize('admin'), async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const allBookings = db.bookings.findAll();
    const bookings = allBookings.filter(b => {
      const createdAt = new Date(b.createdAt);
      return createdAt >= targetDate && createdAt < nextDay;
    });

    const allPayments = db.payments.findAll();
    const payments = allPayments.filter(p => {
      const createdAt = new Date(p.createdAt);
      return createdAt >= targetDate && createdAt < nextDay && p.status === 'success';
    });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalRefunds = payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.refundAmount, 0);

    res.json({
      success: true,
      report: {
        date: targetDate,
        bookings: {
          total: bookings.length,
          active: bookings.filter(b => b.status === 'active').length,
          completed: bookings.filter(b => b.status === 'completed').length,
          cancelled: bookings.filter(b => b.status === 'cancelled').length,
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
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.get('/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const bikes = db.bikes.findAll();
    const users = db.users.findAll();
    const bookings = db.bookings.findAll();
    const payments = db.payments.findAll();

    const totalRevenue = payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0);

    const bookingsByStatus = {};
    bookings.forEach(b => {
      bookingsByStatus[b.status] = (bookingsByStatus[b.status] || 0) + 1;
    });

    const popularBikes = bikes
      .sort((a, b) => (b.totalRides || 0) - (a.totalRides || 0))
      .slice(0, 5);

    res.json({
      success: true,
      overview: {
        bikes: {
          total: bikes.length,
          available: bikes.filter(b => b.available).length,
          inUse: bikes.filter(b => !b.available).length
        },
        users: users.filter(u => u.role === 'user').length,
        bookings: {
          total: bookings.length,
          active: bookings.filter(b => b.status === 'active').length,
          byStatus: Object.keys(bookingsByStatus).map(status => ({
            _id: status,
            count: bookingsByStatus[status]
          }))
        },
        revenue: totalRevenue,
        popularBikes
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.get('/revenue', protect, authorize('admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const payments = db.payments.findAll().filter(p => {
      const createdAt = new Date(p.createdAt);
      return createdAt >= start && createdAt <= end && p.status === 'success';
    });

    const revenueByDay = {};
    payments.forEach(p => {
      const date = new Date(p.createdAt).toISOString().split('T')[0];
      if (!revenueByDay[date]) {
        revenueByDay[date] = { _id: date, totalRevenue: 0, count: 0 };
      }
      revenueByDay[date].totalRevenue += p.amount;
      revenueByDay[date].count += 1;
    });

    res.json({
      success: true,
      revenue: Object.values(revenueByDay).sort((a, b) => a._id.localeCompare(b._id))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
