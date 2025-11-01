import { useState, useEffect } from 'react';
import { Calendar, DollarSign, TrendingUp, Download, Loader } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast from 'react-hot-toast';
import { reportsAPI } from '../../utils/api';

const AdminReports = () => {
  const [dailyReport, setDailyReport] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    fetchDailyReport();
  }, [selectedDate]);

  useEffect(() => {
    fetchRevenueData();
  }, [dateRange]);

  const fetchDailyReport = async () => {
    try {
      setLoading(true);
      const { data } = await reportsAPI.getDaily(selectedDate);
      setDailyReport(data.report);
    } catch (error) {
      toast.error('Failed to fetch daily report');
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const { data } = await reportsAPI.getRevenue(dateRange.start, dateRange.end);
      setRevenueData(data.revenue);
    } catch (error) {
      toast.error('Failed to fetch revenue data');
    }
  };

  const downloadReport = () => {
    const reportData = JSON.stringify(dailyReport, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-report-${selectedDate}.json`;
    a.click();
    toast.success('Report downloaded');
  };

  if (loading && !dailyReport) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="h-12 w-12 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <button
          onClick={downloadReport}
          className="btn-outline flex items-center gap-2"
        >
          <Download className="h-5 w-5" />
          Download Report
        </button>
      </div>

      {/* Daily Report */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Daily Report</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field w-auto"
            max={format(new Date(), 'yyyy-MM-dd')}
          />
        </div>

        {dailyReport && (
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
              <p className="text-3xl font-bold text-blue-600">{dailyReport.bookings?.total || 0}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <p className="text-sm text-gray-600">Active Bookings</p>
              </div>
              <p className="text-3xl font-bold text-green-600">{dailyReport.bookings?.active || 0}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-6 w-6 text-purple-600" />
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
              <p className="text-3xl font-bold text-purple-600">₹{dailyReport.revenue?.total || 0}</p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-6 w-6 text-red-600" />
                <p className="text-sm text-gray-600">Net Revenue</p>
              </div>
              <p className="text-3xl font-bold text-red-600">₹{dailyReport.revenue?.net || 0}</p>
            </div>
          </div>
        )}

        {dailyReport && (
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Booking Status Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold">{dailyReport.bookings?.completed || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Cancelled</span>
                  <span className="font-semibold">{dailyReport.bookings?.cancelled || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Total Payments</span>
                  <span className="font-semibold">{dailyReport.payments || 0}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Revenue Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Gross Revenue</span>
                  <span className="font-semibold text-green-600">₹{dailyReport.revenue?.total || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Refunds</span>
                  <span className="font-semibold text-red-600">₹{dailyReport.revenue?.refunds || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Net Revenue</span>
                  <span className="font-semibold text-blue-600">₹{dailyReport.revenue?.net || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Revenue Chart */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Revenue Trend</h3>
          <div className="flex gap-3">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="input-field w-auto"
            />
            <span className="flex items-center text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="input-field w-auto"
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
        </div>

        {revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalRevenue" 
                stroke="#dc2626" 
                strokeWidth={2}
                name="Revenue (₹)"
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#2563eb" 
                strokeWidth={2}
                name="Bookings"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-20">No revenue data available for selected period</p>
        )}
      </div>

      {/* Recent Bookings */}
      {dailyReport?.bookings?.details && dailyReport.bookings.details.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bike</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dailyReport.bookings.details.slice(0, 10).map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{booking.user?.name}</td>
                    <td className="px-4 py-3 text-sm">{booking.bike?.name}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-red-600">₹{booking.totalAmount}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
