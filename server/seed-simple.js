const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'data');

// Create data directory if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
}

const bikes = [
  {
    _id: 'bike1',
    name: 'KTM Duke 390',
    brand: 'KTM',
    model: 'Duke 390',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=600&fit=crop',
    pricePerDay: 2500,
    pricePerHour: 250,
    securityDeposit: 5000,
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
    totalRides: 45,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'bike2',
    name: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=600&fit=crop',
    pricePerDay: 1800,
    pricePerHour: 180,
    securityDeposit: 3000,
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
    totalRides: 38,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'bike3',
    name: 'Scotty Sport 200',
    brand: 'Scotty',
    model: 'Sport 200',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=600&fit=crop',
    pricePerDay: 1200,
    pricePerHour: 120,
    securityDeposit: 2000,
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
    totalRides: 28,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'bike4',
    name: 'KTM Duke 250',
    brand: 'KTM',
    model: 'Duke 250',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&h=600&fit=crop',
    pricePerDay: 2000,
    pricePerHour: 200,
    securityDeposit: 4000,
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
    totalRides: 32,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'bike5',
    name: 'Royal Enfield Himalayan',
    brand: 'Royal Enfield',
    model: 'Himalayan',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=600&fit=crop',
    pricePerDay: 2200,
    pricePerHour: 220,
    securityDeposit: 4500,
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
    totalRides: 52,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'bike6',
    name: 'Scotty Cruiser 250',
    brand: 'Scotty',
    model: 'Cruiser 250',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&h=600&fit=crop',
    pricePerDay: 1600,
    pricePerHour: 160,
    securityDeposit: 3000,
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
    totalRides: 35,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'bike7',
    name: 'KTM RC 390',
    brand: 'KTM',
    model: 'RC 390',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=600&fit=crop',
    pricePerDay: 3000,
    pricePerHour: 300,
    securityDeposit: 6000,
    registrationNumber: 'DL-07-MN-6789',
    year: 2023,
    specifications: {
      engine: '373.2cc',
      power: '43.5 HP',
      torque: '37 Nm',
      fuelCapacity: '13.7 L',
      weight: '172 kg',
      topSpeed: '179 km/h'
    },
    features: ['Sport Bike', 'Full Fairing', 'Racing Position', 'Quick Shifter'],
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.6139],
      address: 'Connaught Place, New Delhi'
    },
    available: true,
    rating: 4.8,
    totalRides: 41,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'bike8',
    name: 'Royal Enfield Meteor 350',
    brand: 'Royal Enfield',
    model: 'Meteor 350',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=600&fit=crop',
    pricePerDay: 1900,
    pricePerHour: 190,
    securityDeposit: 3500,
    registrationNumber: 'DL-08-OP-4567',
    year: 2023,
    specifications: {
      engine: '349cc',
      power: '20.2 HP',
      torque: '27 Nm',
      fuelCapacity: '15 L',
      weight: '191 kg',
      topSpeed: '115 km/h'
    },
    features: ['Cruiser Style', 'Tripper Navigation', 'Comfortable Seat', 'LED Lights'],
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.6139],
      address: 'Connaught Place, New Delhi'
    },
    available: true,
    rating: 4.7,
    totalRides: 39,
    createdAt: new Date().toISOString()
  }
];

const users = [
  {
    _id: 'user1',
    name: 'Admin User',
    email: 'admin@bikerental.com',
    password: bcrypt.hashSync('admin123', 10),
    phone: '+91 9876543210',
    role: 'admin',
    licenseNumber: 'DL-ADMIN-001',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'user2',
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10),
    phone: '+91 9876543211',
    role: 'user',
    licenseNumber: 'DL-USER-001',
    createdAt: new Date().toISOString()
  }
];

// Write data to files
fs.writeFileSync(path.join(dbPath, 'bikes.json'), JSON.stringify(bikes, null, 2));
fs.writeFileSync(path.join(dbPath, 'users.json'), JSON.stringify(users, null, 2));
fs.writeFileSync(path.join(dbPath, 'bookings.json'), JSON.stringify([], null, 2));
fs.writeFileSync(path.join(dbPath, 'payments.json'), JSON.stringify([], null, 2));

console.log('✅ Database seeded successfully!');
console.log('\nLogin Credentials:');
console.log('Admin: admin@bikerental.com / admin123');
console.log('User: john@example.com / password123');
