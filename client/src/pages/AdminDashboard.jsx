import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bike, Calendar, DollarSign, Users, FileText } from 'lucide-react';
import AdminOverview from '../components/admin/AdminOverview';
import AdminBikes from '../components/admin/AdminBikes';
import AdminBookings from '../components/admin/AdminBookings';
import AdminReports from '../components/admin/AdminReports';

const AdminDashboard = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview' },
    { path: '/admin/bikes', icon: <Bike className="h-5 w-5" />, label: 'Bikes' },
    { path: '/admin/bookings', icon: <Calendar className="h-5 w-5" />, label: 'Bookings' },
    { path: '/admin/reports', icon: <FileText className="h-5 w-5" />, label: 'Reports' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your bike rental business</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-24">
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-red-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <Routes>
              <Route index element={<AdminOverview />} />
              <Route path="bikes" element={<AdminBikes />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="reports" element={<AdminReports />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
