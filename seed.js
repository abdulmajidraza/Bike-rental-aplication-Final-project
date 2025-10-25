const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bike = require('./models/Bike');
const User = require('./models/User');

dotenv.config();

const bikes = [
  {
    name: 'KTM Duke 390',
    brand: 'KTM',
    model: 'Duke 390',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=600&fit=crop',
    pricePerDay: 1200,
    pricePerHour: 100,
    registrationNumber: 'DL-01-AB-1234',
    year: 2023,
    specifications: {
      engine: '373.2cc',
      power: '43.5 HP',
      torque: '37 Nm',
      fuelCapacity: '13.4 L',
      weight: '167 kg',
      topSpeed: '167 km/h'
    },
    features: ['ABS', 'LED Headlights', 'Digital Display', 'Slipper Clutch'],
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.6139],
      address: 'Connaught Place, New Delhi'
    },
    available: true,
    rating: 4.8,
    totalRides: 45
  },
  {
    name: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=600&fit=crop',
    pricePerDay: 1000,
    pricePerHour: 85,
    registrationNumber: 'DL-02-CD-5678',
    year: 2023,
    specifications: {
      engine: '349cc',
      power: '20.2 HP',
      torque: '27 Nm',
      fuelCapacity: '13 L',
      weight: '195 kg',
      topSpeed: '120 km/h'
    },
    features: ['Classic Design', 'Comfortable Seat', 'Chrome Finish', 'Dual Channel ABS'],
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.6139],
      address: 'Connaught Place, New Delhi'
    },
    available: true,
    rating: 4.6,
    totalRides: 38
  },
  {
    name: 'KTM Duke 250',
    brand: 'KTM',
    model: 'Duke 250',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&h=600&fit=crop',
    pricePerDay: 900,
    pricePerHour: 75,
    registrationNumber: 'DL-03-EF-9012',
    year: 2023,
    specifications: {
      engine: '248.8cc',
      power: '30 HP',
      torque: '24 Nm',
      fuelCapacity: '13.4 L',
      weight: '161 kg',
      topSpeed: '140 km/h'
    },
    features: ['ABS', 'LED Lights', 'Digital Console', 'Lightweight'],
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.6139],
      address: 'Connaught Place, New Delhi'
    },
    available: true,
    rating: 4.7,
    totalRides: 32
  },
  {
    name: 'Royal Enfield Himalayan',
    brand: 'Royal Enfield',
    model: 'Himalayan',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=600&fit=crop',
    pricePerDay: 1300,
    pricePerHour: 110,
    registrationNumber: 'DL-04-GH-3456',
    year: 2023,
    specifications: {
      engine: '411cc',
      power: '24.3 HP',
      torque: '32 Nm',
      fuelCapacity: '15 L',
      weight: '199 kg',
      topSpeed: '130 km/h'
    },
    features: ['Adventure Ready', 'Long Travel Suspension', 'Dual Purpose Tyres', 'Windscreen'],
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.6139],
      address: 'Connaught Place, New Delhi'
    },
    available: true,
    rating: 4.9,
    totalRides: 52
  },
  {
    name: 'Scotty Sport 200',
    brand: 'Scotty',
    model: 'Sport 200',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=600&fit=crop',
    pricePerDay: 800,
    pricePerHour: 70,
    registrationNumber: 'DL-05-IJ-7890',
    year: 2023,
    specifications: {
      engine: '199cc',
      power: '25 HP',
      torque: '18.5 Nm',
      fuelCapacity: '12 L',
      weight: '145 kg',
      topSpeed: '135 km/h'
    },
    features: ['Sporty Design', 'Fuel Efficient', 'Disc Brakes', 'Digital Meter'],
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.6139],
      address: 'Connaught Place, New Delhi'
    },
    available: true,
    rating: 4.5,
    totalRides: 28
  },
  {
    name: 'Scotty Cruiser 250',
    brand: 'Scotty',
    model: 'Cruiser 250',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&h=600&fit=crop',
    pricePerDay: 950,
    pricePerHour: 80,
    registrationNumber: 'DL-06-KL-2345',
    year: 2023,
    specifications: {
      engine: '249cc',
      power: '28 HP',
      torque: '22 Nm',
      fuelCapacity: '14 L',
      weight: '165 kg',
      topSpeed: '145 km/h'
    },
    features: ['Comfortable Ride', 'Cruise Control', 'LED Lights', 'USB Charging'],
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.6139],
      address: 'Connaught Place, New Delhi'
    },
    available: true,
    rating: 4.6,
    totalRides: 35
  }
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@bikerental.com',
    password: 'admin123',
    phone: '+91 9876543210',
    role: 'admin',
    licenseNumber: 'DL-ADMIN-001'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+91 9876543211',
    role: 'user',
    licenseNumber: 'DL-USER-001'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bike-rental', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Bike.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Insert bikes
    await Bike.insertMany(bikes);
    console.log('✅ Bikes seeded successfully');

    // Insert users
    await User.insertMany(users);
    console.log('✅ Users seeded successfully');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin@bikerental.com / admin123');
    console.log('User: john@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
