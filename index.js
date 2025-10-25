const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Make io accessible to routes
app.set('io', io);

// Initialize JSON database files
const dbPath = path.join(__dirname, 'data');
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
}

const initDB = () => {
  const files = ['users.json', 'bikes.json', 'bookings.json', 'payments.json'];
  files.forEach(file => {
    const filePath = path.join(dbPath, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
    }
  });
};

initDB();
console.log('✅ JSON Database initialized successfully');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bikes', require('./routes/bikes'));
app.use('/api/bookings', require('./routes/bookings-simple'));
app.use('/api/payments', require('./routes/payments-simple'));
app.use('/api/reports', require('./routes/reports-simple'));

// Socket.io for live tracking
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('updateLocation', (data) => {
    // Broadcast location update to all clients tracking this bike
    socket.broadcast.emit('locationUpdate', data);
  });

  socket.on('joinTracking', (bookingId) => {
    socket.join(`booking-${bookingId}`);
    console.log(`Client joined tracking room: booking-${bookingId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
