import { useState, useEffect } from 'react';
import { Search, Filter, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import BikeCard from '../components/BikeCard';
import { bikesAPI } from '../utils/api';

const Bikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: '',
    available: '',
    search: '',
  });

  useEffect(() => {
    fetchBikes();
  }, [filters]);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.brand) params.brand = filters.brand;
      if (filters.available) params.available = filters.available;

      const { data } = await bikesAPI.getAll(params);
      
      let filteredBikes = data.bikes;
      
      // Apply search filter
      if (filters.search) {
        filteredBikes = filteredBikes.filter(bike =>
          bike.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          bike.model.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      setBikes(filteredBikes);
    } catch (error) {
      toast.error('Failed to fetch bikes');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Bikes</h1>
          <p className="text-gray-600">Choose from our wide selection of premium bikes</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bikes..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="input-field"
            >
              <option value="">All Brands</option>
              <option value="KTM">KTM</option>
              <option value="Royal Enfield">Royal Enfield</option>
              <option value="Scotty">Scotty</option>
            </select>

            <select
              value={filters.available}
              onChange={(e) => handleFilterChange('available', e.target.value)}
              className="input-field"
            >
              <option value="">All Bikes</option>
              <option value="true">Available Only</option>
              <option value="false">Unavailable</option>
            </select>

            <button
              onClick={() => setFilters({ brand: '', available: '', search: '' })}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Bikes Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="h-12 w-12 text-red-600 animate-spin" />
          </div>
        ) : bikes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No bikes found matching your criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bikes.map((bike) => (
              <BikeCard key={bike._id} bike={bike} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bikes;
