# 🏍️ Bike Rental Full Stack Application

A comprehensive bike rental platform built with the MERN stack featuring real-time tracking, payment integration, and admin dashboard.

## ✨ Features

### User Features
- 🔐 **Authentication** - Secure login and signup with JWT
- 🏍️ **Bike Browsing** - Browse bikes by brand (KTM, Royal Enfield, Scotty)
- 🔍 **Advanced Filters** - Filter by brand, availability, and price
- 📅 **Flexible Booking** - Rent bikes hourly or daily
- 💳 **Payment Integration** - Secure payments via Stripe
- 📍 **Live Tracking** - Real-time GPS tracking of rented bikes
- ❌ **Booking Cancellation** - Cancel bookings with automatic refunds
- 👤 **Profile Management** - Update personal information
- 📱 **Responsive Design** - Works seamlessly on all devices

### Admin Features
- 📊 **Dashboard** - Overview of business metrics
- 🏍️ **Bike Management** - Add, edit, and delete bikes
- 📋 **Booking Management** - View and update booking status
- 📈 **Reports & Analytics** - Daily reports and revenue trends
- 💰 **Revenue Tracking** - Track earnings and refunds
- 👥 **User Management** - View customer details

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Leaflet** - Maps and live tracking
- **Stripe** - Payment processing
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Socket.io** - Real-time tracking
- **Stripe** - Payment gateway
- **Express Validator** - Input validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Stripe account (for payments)

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd "bike rental full stack"
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup

#### Server Environment (.env)
Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bike-rental
JWT_SECRET=your_jwt_secret_key_here_change_in_production
STRIPE_SECRET_KEY=your_stripe_secret_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### Client Environment (.env)
Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
```

### 4. Seed the Database
```bash
cd server
node seed.js
```

This will create:
- 6 sample bikes (KTM Duke, Royal Enfield, Scotty models)
- 2 users (1 admin, 1 regular user)

**Default Login Credentials:**
- **Admin:** admin@bikerental.com / admin123
- **User:** john@example.com / password123

### 5. Start the Application

#### Development Mode (Recommended)
From the root directory:
```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 5173) concurrently.

#### Or start separately:

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

### 6. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

## 📱 Usage Guide

### For Users

1. **Sign Up**
   - Navigate to `/signup`
   - Fill in your details including license number
   - Create an account

2. **Browse Bikes**
   - View all available bikes on `/bikes`
   - Use filters to find your preferred bike
   - Click on a bike to view details

3. **Book a Bike**
   - Select rental type (hourly/daily)
   - Choose start and end dates
   - Review total amount
   - Click "Book Now"
   - Complete payment via Stripe

4. **Track Your Booking**
   - View all bookings on `/bookings`
   - Click on a booking to see details
   - Track bike location in real-time (for active bookings)

5. **Cancel Booking**
   - Open booking details
   - Click "Cancel Booking"
   - Provide cancellation reason
   - Automatic refund will be processed

### For Admins

1. **Access Dashboard**
   - Login with admin credentials
   - Navigate to `/admin`

2. **Manage Bikes**
   - Add new bikes with images and specifications
   - Edit existing bike details
   - Delete bikes
   - Update availability status

3. **Manage Bookings**
   - View all bookings
   - Update booking status
   - Filter by status

4. **View Reports**
   - Check daily reports
   - View revenue trends
   - Download reports
   - Analyze business metrics

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Bikes
- `GET /api/bikes` - Get all bikes
- `GET /api/bikes/:id` - Get bike by ID
- `POST /api/bikes` - Create bike (Admin)
- `PUT /api/bikes/:id` - Update bike (Admin)
- `DELETE /api/bikes/:id` - Delete bike (Admin)

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/location` - Update location
- `PUT /api/bookings/:id/status` - Update status (Admin)

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/refund` - Process refund
- `GET /api/payments` - Get payment history

### Reports
- `GET /api/reports/daily` - Get daily report (Admin)
- `GET /api/reports/overview` - Get overview (Admin)
- `GET /api/reports/revenue` - Get revenue data (Admin)

## 🎨 UI Components

### Reusable Components
- **Navbar** - Navigation with authentication state
- **BikeCard** - Bike display card
- **BookingCard** - Booking display card
- **MapView** - Interactive map with Leaflet
- **PaymentModal** - Stripe payment integration
- **PrivateRoute** - Protected route wrapper
- **AdminRoute** - Admin-only route wrapper

### Pages
- **Home** - Landing page with features
- **Login/Signup** - Authentication pages
- **Bikes** - Bike listing with filters
- **BikeDetails** - Detailed bike view with booking
- **Bookings** - User's booking history
- **BookingDetails** - Detailed booking view with tracking
- **Profile** - User profile management
- **AdminDashboard** - Admin panel with sub-routes

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- CORS configuration
- Environment variable protection

## 📊 Database Schema

### User
- name, email, password (hashed)
- phone, licenseNumber
- role (user/admin)

### Bike
- name, brand, model, image
- pricePerDay, pricePerHour
- specifications, features
- location (GeoJSON)
- available, rating, totalRides

### Booking
- user, bike (references)
- startDate, endDate, duration
- totalAmount, status, paymentStatus
- pickupLocation, currentLocation
- cancellationReason

### Payment
- booking, user (references)
- amount, currency, paymentMethod
- transactionId, status
- refundAmount, refundReason

## 🚧 Future Enhancements

- [ ] Email notifications
- [ ] SMS alerts
- [ ] Multiple payment gateways (Razorpay, PayPal)
- [ ] Bike reviews and ratings
- [ ] Loyalty program
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env file

### Stripe Payment Issues
- Verify Stripe API keys
- Use test mode keys for development
- Check Stripe dashboard for errors

### Socket.io Connection Failed
- Ensure backend is running
- Check CORS configuration
- Verify socket URL in client

### Build Errors
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify all dependencies are installed

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For issues and questions:
- Create an issue in the repository
- Contact: support@bikerental.com

## 🙏 Acknowledgments

- Icons by Lucide
- Maps by Leaflet & OpenStreetMap
- Payment processing by Stripe
- UI inspiration from modern rental platforms

---

**Built with ❤️ using MERN Stack**
