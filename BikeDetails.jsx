import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Gauge, Calendar, Clock, MapPin, Loader, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { bikesAPI, bookingsAPI } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import PaymentModal from '../components/PaymentModal';

const BikeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    rentalType: 'daily',
    duration: 1,
  });

  useEffect(() => {
    fetchBikeDetails();
  }, [id]);

  useEffect(() => {
    calculateDuration();
  }, [bookingData.startDate, bookingData.endDate, bookingData.rentalType]);

  const fetchBikeDetails = async () => {
    try {
      const { data } = await bikesAPI.getById(id);
      setBike(data.bike);
    } catch (error) {
      toast.error('Failed to fetch bike details');
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = () => {
    if (bookingData.startDate && bookingData.endDate) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const diffTime = Math.abs(end - start);
      
      if (bookingData.rentalType === 'hourly') {
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        setBookingData(prev => ({ ...prev, duration: diffHours }));
      } else {
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setBookingData(prev => ({ ...prev, duration: diffDays || 1 }));
      }
    }
  };

  const calculateTotalAmount = () => {
    if (!bike) return 0;
    const price = bookingData.rentalType === 'hourly' ? bike.pricePerHour : bike.pricePerDay;
    const rentalAmount = price * bookingData.duration;
    const securityDeposit = bike.securityDeposit || 0;
    return rentalAmount + securityDeposit;
  };

  const calculateRentalAmount = () => {
    if (!bike) return 0;
    const price = bookingData.rentalType === 'hourly' ? bike.pricePerHour : bike.pricePerDay;
    return price * bookingData.duration;
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a bike');
      navigate('/login');
      return;
    }

    if (!bookingData.startDate || !bookingData.endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    setBookingLoading(true);

    try {
      const { data } = await bookingsAPI.create({
        bikeId: bike._id,
        ...bookingData,
        pickupLocation: {
          coordinates: bike.location.coordinates,
          address: bike.location.address,
        },
      });

      if (data.success) {
        setCurrentBooking(data.booking);
        setShowPaymentModal(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    toast.success('Booking confirmed!');
    navigate('/bookings');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Bike not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bike Image and Info */}
          <div>
            <div className="card overflow-hidden mb-6">
              <img
                src={bike.image}
                alt={bike.name}
                className="w-full h-96 object-cover"
              />
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{bike.name}</h1>
                  <p className="text-xl text-gray-600">{bike.brand} - {bike.model}</p>
                </div>
                <div className={`px-4 py-2 rounded-full ${bike.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {bike.available ? 'Available' : 'Not Available'}
                </div>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{bike.rating || 'New'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Gauge className="h-5 w-5" />
                  <span>{bike.totalRides || 0} rides</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{bike.location?.address || 'Location available'}</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {bike.specifications?.engine && (
                    <div>
                      <p className="text-gray-600 text-sm">Engine</p>
                      <p className="font-semibold">{bike.specifications.engine}</p>
                    </div>
                  )}
                  {bike.specifications?.power && (
                    <div>
                      <p className="text-gray-600 text-sm">Power</p>
                      <p className="font-semibold">{bike.specifications.power}</p>
                    </div>
                  )}
                  {bike.specifications?.torque && (
                    <div>
                      <p className="text-gray-600 text-sm">Torque</p>
                      <p className="font-semibold">{bike.specifications.torque}</p>
                    </div>
                  )}
                  {bike.specifications?.topSpeed && (
                    <div>
                      <p className="text-gray-600 text-sm">Top Speed</p>
                      <p className="font-semibold">{bike.specifications.topSpeed}</p>
                    </div>
                  )}
                </div>
              </div>

              {bike.features && bike.features.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {bike.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book This Bike</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rental Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setBookingData({ ...bookingData, rentalType: 'hourly' })}
                      className={`p-3 border-2 rounded-lg ${
                        bookingData.rentalType === 'hourly'
                          ? 'border-red-600 bg-red-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <Clock className="h-5 w-5 mx-auto mb-1" />
                      <p className="font-semibold">Hourly</p>
                      <p className="text-sm text-gray-600">₹{bike.pricePerHour}/hr</p>
                    </button>
                    <button
                      onClick={() => setBookingData({ ...bookingData, rentalType: 'daily' })}
                      className={`p-3 border-2 rounded-lg ${
                        bookingData.rentalType === 'daily'
                          ? 'border-red-600 bg-red-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <Calendar className="h-5 w-5 mx-auto mb-1" />
                      <p className="font-semibold">Daily</p>
                      <p className="text-sm text-gray-600">₹{bike.pricePerDay}/day</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingData.startDate}
                    onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                    className="input-field"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingData.endDate}
                    onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                    className="input-field"
                    min={bookingData.startDate}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">
                    {bookingData.duration} {bookingData.rentalType === 'hourly' ? 'hours' : 'days'}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price per {bookingData.rentalType === 'hourly' ? 'hour' : 'day'}</span>
                  <span className="font-semibold">
                    ₹{bookingData.rentalType === 'hourly' ? bike.pricePerHour : bike.pricePerDay}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Rental Amount</span>
                  <span className="font-semibold">₹{calculateRentalAmount()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="font-semibold text-blue-600">₹{bike.securityDeposit || 0}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-red-600">₹{calculateTotalAmount()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">*Security deposit will be refunded after bike return</p>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={!bike.available || bookingLoading}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {bookingLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Book Now'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {currentBooking && (
        <PaymentModal
          booking={currentBooking}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default BikeDetails;
