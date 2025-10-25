import { Link } from 'react-router-dom';
import { Bike, Shield, Clock, MapPin, Star, TrendingUp } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Bike className="h-8 w-8 text-red-600" />,
      title: 'Wide Selection',
      description: 'Choose from KTM Duke, Royal Enfield, and Scotty bikes',
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: 'Safe & Secure',
      description: 'All bikes are regularly maintained and insured',
    },
    {
      icon: <Clock className="h-8 w-8 text-red-600" />,
      title: 'Flexible Rental',
      description: 'Rent by the hour or by the day at affordable prices',
    },
    {
      icon: <MapPin className="h-8 w-8 text-red-600" />,
      title: 'Live Tracking',
      description: 'Track your rented bike in real-time on the map',
    },
  ];

  const popularBikes = [
    {
      name: 'KTM Duke 390',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&h=300&fit=crop',
      price: 1200,
    },
    {
      name: 'Royal Enfield Classic 350',
      image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=500&h=300&fit=crop',
      price: 1000,
    },
    {
      name: 'Scotty Sport',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&h=300&fit=crop',
      price: 800,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Rent Your Dream Bike Today
              </h1>
              <p className="text-xl mb-8 text-red-100">
                Experience the thrill of riding premium bikes. Choose from KTM, Royal Enfield, and more. 
                Book instantly with live tracking and flexible payment options.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/bikes" className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Browse Bikes
                </Link>
                <Link to="/signup" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors">
                  Get Started
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&h=400&fit=crop"
                alt="Bike"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600">Experience the best bike rental service</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Bikes Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Bikes</h2>
            <p className="text-xl text-gray-600">Most loved bikes by our customers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {popularBikes.map((bike, index) => (
              <div key={index} className="card overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={bike.image}
                    alt={bike.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{bike.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-red-600">₹{bike.price}</p>
                      <p className="text-sm text-gray-500">per day</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/bikes" className="btn-primary inline-block">
              View All Bikes
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-red-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-red-100">Premium Bikes</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-red-100">Customer Support</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4.9</div>
              <div className="text-red-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Hit the Road?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Sign up now and get your first ride with special discount!
          </p>
          <Link to="/signup" className="btn-primary inline-block text-lg px-10 py-4">
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
