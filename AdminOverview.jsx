import { useState, useEffect } from 'react';
import { Bike, Users, Calendar, DollarSign, TrendingUp, Loader } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';
import { reportsAPI } from '../../utils/api';

const AdminOverview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const { data } = await reportsAPI.getOverview();
      setOverview(data.overview);
    } catch (error) {
      toast.error('Failed to fetch overview');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="h-12 w-12 text-red-600 animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      icon: <Bike className="h-8 w-8 text-blue-600" />,
      label: 'Total Bikes',
      value: overview?.bikes?.total || 0,
      subtext: `${overview?.bikes?.available || 0} available`,
      bgColor: 'bg-blue-100',
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      label: 'Total Users',
      value: overview?.users || 0,
      subtext: 'Registered customers',
      bgColor: 'bg-green-100',
    },
    {
      icon: <Calendar className="h-8 w-8 text-purple-600" />,
      label: 'Total Bookings',
      value: overview?.bookings?.total || 0,
      subtext: `${overview?.bookings?.active || 0} active`,
      bgColor: 'bg-purple-100',
    },
    {
      icon: <DollarSign className="h-8 w-8 text-red-600" />,
      label: 'Total Revenue',
      value: `₹${overview?.revenue || 0}`,
      subtext: 'All time earnings',
      bgColor: 'bg-red-100',
    },
  ];

  const bookingStatusData = overview?.bookings?.byStatus?.map(item => ({
    name: item._id,
    count: item.count,
  })) || [];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 font-medium">{stat.label}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bookings by Status */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Bookings by Status</h3>
          {bookingStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-20">No data available</p>
          )}
        </div>

        {/* Popular Bikes */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Bikes</h3>
          <div className="space-y-4">
            {overview?.popularBikes?.map((bike, index) => (
              <div key={bike._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{bike.name}</p>
                    <p className="text-sm text-gray-600">{bike.brand} - {bike.model}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{bike.totalRides} rides</p>
                  <div className="flex items-center gap-1 text-sm text-yellow-600">
                    <span>★</span>
                    <span>{bike.rating || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )) || <p className="text-gray-500 text-center py-10">No data available</p>}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Statistics</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{overview?.bikes?.inUse || 0}</p>
            <p className="text-gray-600 mt-1">Bikes in Use</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{overview?.bikes?.available || 0}</p>
            <p className="text-gray-600 mt-1">Available Bikes</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">{overview?.bookings?.active || 0}</p>
            <p className="text-gray-600 mt-1">Active Bookings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
