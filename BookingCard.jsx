import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

const BookingCard = ({ booking }) => {
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

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Link to={`/bookings/${booking._id}`} className="card p-5 hover:shadow-2xl transition-shadow">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <img
            src={booking.bike?.image}
            alt={booking.bike?.name}
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
        
        <div className="md:w-2/3 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{booking.bike?.name}</h3>
              <p className="text-gray-600">{booking.bike?.brand} - {booking.bike?.model}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                {booking.status.toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(booking.paymentStatus)}`}>
                {booking.paymentStatus.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(booking.startDate), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{booking.duration} {booking.rentalType === 'hourly' ? 'hours' : 'days'}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t">
            <div className="flex items-center gap-2 text-gray-600">
              <CreditCard className="h-5 w-5" />
              <span className="text-2xl font-bold text-red-600">₹{booking.totalAmount}</span>
            </div>
            <button className="btn-outline text-sm px-4 py-2">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookingCard;
