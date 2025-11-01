import { Link } from 'react-router-dom';
import { Star, Gauge, Calendar } from 'lucide-react';

const BikeCard = ({ bike }) => {
  return (
    <Link to={`/bikes/${bike._id}`} className="card overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={bike.image}
          alt={bike.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {!bike.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              Not Available
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-md">
          <span className="text-sm font-semibold text-gray-800">{bike.brand}</span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{bike.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{bike.model}</p>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">{bike.rating || 'New'}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Gauge className="h-4 w-4" />
            <span className="text-sm">{bike.totalRides || 0} rides</span>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-2xl font-bold text-red-600">₹{bike.pricePerDay}</p>
              <p className="text-xs text-gray-500">per day</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-800">₹{bike.pricePerHour}</p>
              <p className="text-xs text-gray-500">per hour</p>
            </div>
          </div>
          {bike.securityDeposit && (
            <div className="text-center py-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600">Security Deposit: <span className="font-semibold text-blue-600">₹{bike.securityDeposit}</span></p>
            </div>
          )}
        </div>
        
        <button className="w-full mt-4 btn-primary">
          View Details
        </button>
      </div>
    </Link>
  );
};

export default BikeCard;
