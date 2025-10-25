import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { bikesAPI } from '../../utils/api';

const AdminBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBike, setEditingBike] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: 'KTM',
    model: '',
    image: '',
    pricePerDay: '',
    pricePerHour: '',
    registrationNumber: '',
    year: new Date().getFullYear(),
    specifications: {
      engine: '',
      power: '',
      torque: '',
      fuelCapacity: '',
      weight: '',
      topSpeed: '',
    },
    features: [],
    location: {
      coordinates: [77.2090, 28.6139],
      address: '',
    },
  });

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const { data } = await bikesAPI.getAll();
      setBikes(data.bikes);
    } catch (error) {
      toast.error('Failed to fetch bikes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingBike) {
        await bikesAPI.update(editingBike._id, formData);
        toast.success('Bike updated successfully');
      } else {
        await bikesAPI.create(formData);
        toast.success('Bike added successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchBikes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (bike) => {
    setEditingBike(bike);
    setFormData({
      name: bike.name,
      brand: bike.brand,
      model: bike.model,
      image: bike.image,
      pricePerDay: bike.pricePerDay,
      pricePerHour: bike.pricePerHour,
      registrationNumber: bike.registrationNumber,
      year: bike.year,
      specifications: bike.specifications || {},
      features: bike.features || [],
      location: bike.location || { coordinates: [77.2090, 28.6139], address: '' },
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bike?')) return;
    
    try {
      await bikesAPI.delete(id);
      toast.success('Bike deleted successfully');
      fetchBikes();
    } catch (error) {
      toast.error('Failed to delete bike');
    }
  };

  const resetForm = () => {
    setEditingBike(null);
    setFormData({
      name: '',
      brand: 'KTM',
      model: '',
      image: '',
      pricePerDay: '',
      pricePerHour: '',
      registrationNumber: '',
      year: new Date().getFullYear(),
      specifications: {
        engine: '',
        power: '',
        torque: '',
        fuelCapacity: '',
        weight: '',
        topSpeed: '',
      },
      features: [],
      location: {
        coordinates: [77.2090, 28.6139],
        address: '',
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="h-12 w-12 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Bikes</h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add New Bike
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bikes.map((bike) => (
          <div key={bike._id} className="card overflow-hidden">
            <img
              src={bike.image}
              alt={bike.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900">{bike.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{bike.brand} - {bike.model}</p>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xl font-bold text-red-600">₹{bike.pricePerDay}</p>
                  <p className="text-xs text-gray-500">per day</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  bike.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {bike.available ? 'Available' : 'In Use'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(bike)}
                  className="flex-1 btn-outline text-sm py-2 flex items-center justify-center gap-1"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(bike._id)}
                  className="flex-1 bg-red-600 text-white text-sm py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingBike ? 'Edit Bike' : 'Add New Bike'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="input-field"
                  >
                    <option value="KTM">KTM</option>
                    <option value="Royal Enfield">Royal Enfield</option>
                    <option value="Scotty">Scotty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day</label>
                  <input
                    type="number"
                    required
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Hour</label>
                  <input
                    type="number"
                    required
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                  <input
                    type="text"
                    required
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Address</label>
                  <input
                    type="text"
                    value={formData.location.address}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      location: { ...formData.location, address: e.target.value }
                    })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingBike ? 'Update Bike' : 'Add Bike'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBikes;
