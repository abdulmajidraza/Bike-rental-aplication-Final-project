import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard, Loader, XCircle, Navigation } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { bookingsAPI, paymentsAPI } from '../utils/api';
import MapView from '../components/MapView';
import socketService from '../utils/socket';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
    
    // Connect to socket for live tracking
    const socket = socketService.connect();
    socketService.joinTracking(id);
    
    socketService.onLocationUpdate((data) => {
      if (data.bookingId === id) {
        setCurrentLocation(data.location);
      }
    });

    return () => {
      socketService.offLocationUpdate();
    };
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const { data } = await bookingsAPI.getById(id);
      setBooking(data.booking);
      if (data.booking.currentLocation) {
        setCurrentLocation(data.booking.currentLocation);
      }
    } catch (error) {
      toast.error('Failed to fetch booking details');
      navigate('/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    setCancelLoading(true);

    try {
      await bookingsAPI.cancel(id, cancelReason);
      
      // Request refund if payment was made
      if (booking.paymentStatus === 'paid') {
        await paymentsAPI.refund({
          bookingId: id,
          reason: cancelReason,
        });
      }

      toast.success('Booking cancelled successfully');
      setShowCancelModal(false);
      fetchBookingDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Booking not found</p>
      </div>
    );
  }

  const mapMarkers = [];
  if (currentLocation?.coordinates) {
    mapMarkers.push({
      position: [currentLocation.coordinates[1], currentLocation.coordinates[0]],
      popup: 'Current Location',
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Details</h1>
          <p className="text-gray-600">Booking ID: {booking._id}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bike Info */}
            <div className="card p-6">
              <div className="flex gap-6">
                <img
                  src={booking.bike?.image}
                  alt={booking.bike?.name}
                  className="w-48 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{booking.bike?.name}</h2>
                      <p className="text-gray-600">{booking.bike?.brand} - {booking.bike?.model}</p>
                      <p className="text-sm text-gray-500 mt-1">Reg: {booking.bike?.registrationNumber}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Info */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-semibold">{format(new Date(booking.startDate), 'PPp')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-semibold">{format(new Date(booking.endDate), 'PPp')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold">
                      {booking.duration} {booking.rentalType === 'hourly' ? 'hours' : 'days'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold text-red-600">₹{booking.totalAmount}</p>
                  </div>
                </div>
              </div>

              {booking.pickupLocation?.address && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Pickup Location</p>
                      <p className="font-semibold">{booking.pickupLocation.address}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Live Tracking */}
            {booking.status === 'active' && currentLocation && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Live Tracking</h3>
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Live</span>
                  </div>
                </div>
                <MapView
                  center={[currentLocation.coordinates[1], currentLocation.coordinates[0]]}
                  markers={mapMarkers}
                  height="400px"
                />
                {currentLocation.lastUpdated && (
                  <p className="text-sm text-gray-500 mt-2">
                    Last updated: {format(new Date(currentLocation.lastUpdated), 'PPp')}
                  </p>
                )}
              </div>
            )}

            {/* Cancellation Info */}
            {booking.status === 'cancelled' && (
              <div className="card p-6 bg-red-50 border border-red-200">
                <h3 className="text-xl font-bold text-red-900 mb-2">Booking Cancelled</h3>
                <p className="text-red-700 mb-2">Reason: {booking.cancellationReason}</p>
                <p className="text-sm text-red-600">
                  Cancelled on: {format(new Date(booking.cancelledAt), 'PPp')}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Status */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    booking.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.paymentStatus.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Amount</span>
                  <span className="text-red-600">₹{booking.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="h-5 w-5" />
                  Cancel Booking
                </button>
              </div>
            )}

            {/* User Info */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-semibold">{booking.user?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-semibold">{booking.user?.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-semibold">{booking.user?.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">License</p>
                  <p className="font-semibold">{booking.user?.licenseNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cancel Booking</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this booking? Please provide a reason.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              className="input-field mb-4 h-24 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 btn-secondary"
                disabled={cancelLoading}
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                disabled={cancelLoading}
              >
                {cancelLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Cancel Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
