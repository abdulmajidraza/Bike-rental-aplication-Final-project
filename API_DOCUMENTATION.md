# 📡 API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Auth Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91 9876543210",
  "licenseNumber": "DL-USER-001"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "role": "user",
    "licenseNumber": "DL-USER-001"
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "role": "user",
    "licenseNumber": "DL-USER-001"
  }
}
```

### Get Current User
```http
GET /auth/me
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "role": "user",
    "licenseNumber": "DL-USER-001"
  }
}
```

---

## 🏍️ Bikes Endpoints

### Get All Bikes
```http
GET /bikes
```

**Query Parameters:**
- `brand` (optional): Filter by brand (KTM, Royal Enfield, Scotty)
- `available` (optional): Filter by availability (true/false)
- `minPrice` (optional): Minimum price per day
- `maxPrice` (optional): Maximum price per day

**Example:**
```http
GET /bikes?brand=KTM&available=true
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "bikes": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "KTM Duke 390",
      "brand": "KTM",
      "model": "Duke 390",
      "image": "https://example.com/bike.jpg",
      "pricePerDay": 1200,
      "pricePerHour": 100,
      "registrationNumber": "DL-01-AB-1234",
      "year": 2023,
      "specifications": {
        "engine": "373.2cc",
        "power": "43.5 HP",
        "torque": "37 Nm",
        "fuelCapacity": "13.4 L",
        "weight": "167 kg",
        "topSpeed": "167 km/h"
      },
      "features": ["ABS", "LED Headlights", "Digital Display"],
      "available": true,
      "rating": 4.8,
      "totalRides": 45,
      "location": {
        "type": "Point",
        "coordinates": [77.2090, 28.6139],
        "address": "Connaught Place, New Delhi"
      }
    }
  ]
}
```

### Get Bike by ID
```http
GET /bikes/:id
```

**Response:**
```json
{
  "success": true,
  "bike": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "KTM Duke 390",
    ...
  }
}
```

### Create Bike (Admin Only)
```http
POST /bikes
```
**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "KTM Duke 390",
  "brand": "KTM",
  "model": "Duke 390",
  "image": "https://example.com/bike.jpg",
  "pricePerDay": 1200,
  "pricePerHour": 100,
  "registrationNumber": "DL-01-AB-1234",
  "year": 2023,
  "specifications": {
    "engine": "373.2cc",
    "power": "43.5 HP"
  },
  "features": ["ABS", "LED Headlights"],
  "location": {
    "coordinates": [77.2090, 28.6139],
    "address": "Connaught Place, New Delhi"
  }
}
```

### Update Bike (Admin Only)
```http
PUT /bikes/:id
```
**Headers:** `Authorization: Bearer <admin_token>`

### Delete Bike (Admin Only)
```http
DELETE /bikes/:id
```
**Headers:** `Authorization: Bearer <admin_token>`

---

## 📅 Bookings Endpoints

### Get All Bookings
```http
GET /bookings
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "bookings": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+91 9876543210"
      },
      "bike": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "KTM Duke 390",
        "brand": "KTM",
        "model": "Duke 390",
        "image": "https://example.com/bike.jpg",
        "pricePerDay": 1200,
        "pricePerHour": 100
      },
      "startDate": "2024-01-15T10:00:00.000Z",
      "endDate": "2024-01-17T10:00:00.000Z",
      "rentalType": "daily",
      "duration": 2,
      "totalAmount": 2400,
      "status": "confirmed",
      "paymentStatus": "paid",
      "createdAt": "2024-01-14T08:00:00.000Z"
    }
  ]
}
```

### Get Booking by ID
```http
GET /bookings/:id
```
**Headers:** `Authorization: Bearer <token>`

### Create Booking
```http
POST /bookings
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "bikeId": "507f1f77bcf86cd799439013",
  "startDate": "2024-01-15T10:00:00.000Z",
  "endDate": "2024-01-17T10:00:00.000Z",
  "rentalType": "daily",
  "duration": 2,
  "pickupLocation": {
    "coordinates": [77.2090, 28.6139],
    "address": "Connaught Place, New Delhi"
  }
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "_id": "507f1f77bcf86cd799439011",
    "user": "507f1f77bcf86cd799439012",
    "bike": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "KTM Duke 390",
      ...
    },
    "totalAmount": 2400,
    "status": "pending",
    ...
  }
}
```

### Cancel Booking
```http
PUT /bookings/:id/cancel
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "reason": "Change of plans"
}
```

### Update Booking Location
```http
PUT /bookings/:id/location
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "coordinates": [77.2090, 28.6139],
  "address": "Current location address"
}
```

### Update Booking Status (Admin Only)
```http
PUT /bookings/:id/status
```
**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "status": "active"
}
```

---

## 💳 Payments Endpoints

### Create Payment Intent
```http
POST /payments/create-payment-intent
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "bookingId": "507f1f77bcf86cd799439011",
  "paymentMethod": "card"
}
```

**Response:**
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### Confirm Payment
```http
POST /payments/confirm
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "bookingId": "507f1f77bcf86cd799439011",
  "transactionId": "pi_xxx",
  "paymentMethod": "card"
}
```

### Request Refund
```http
POST /payments/refund
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "bookingId": "507f1f77bcf86cd799439011",
  "reason": "Booking cancelled"
}
```

### Get Payment History
```http
GET /payments
```
**Headers:** `Authorization: Bearer <token>`

---

## 📊 Reports Endpoints (Admin Only)

### Get Daily Report
```http
GET /reports/daily?date=2024-01-15
```
**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "report": {
    "date": "2024-01-15T00:00:00.000Z",
    "bookings": {
      "total": 10,
      "active": 3,
      "completed": 5,
      "cancelled": 2,
      "details": [...]
    },
    "revenue": {
      "total": 12000,
      "refunds": 2000,
      "net": 10000
    },
    "payments": 8
  }
}
```

### Get Overview
```http
GET /reports/overview
```
**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "overview": {
    "bikes": {
      "total": 50,
      "available": 35,
      "inUse": 15
    },
    "users": 150,
    "bookings": {
      "total": 500,
      "active": 15,
      "byStatus": [
        { "_id": "completed", "count": 400 },
        { "_id": "active", "count": 15 },
        { "_id": "cancelled", "count": 85 }
      ]
    },
    "revenue": 500000,
    "popularBikes": [...]
  }
}
```

### Get Revenue Data
```http
GET /reports/revenue?startDate=2024-01-01&endDate=2024-01-31
```
**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "revenue": [
    {
      "_id": "2024-01-15",
      "totalRevenue": 12000,
      "count": 10
    },
    ...
  ]
}
```

---

## 🔌 WebSocket Events

### Connect to Socket
```javascript
const socket = io('http://localhost:5000');
```

### Join Tracking Room
```javascript
socket.emit('joinTracking', bookingId);
```

### Update Location
```javascript
socket.emit('updateLocation', {
  bookingId: '507f1f77bcf86cd799439011',
  location: {
    coordinates: [77.2090, 28.6139],
    lastUpdated: new Date()
  }
});
```

### Listen for Location Updates
```javascript
socket.on('locationUpdate', (data) => {
  console.log('New location:', data);
});
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "msg": "Email is required",
      "param": "email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role user is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Bike not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details (in development mode)"
}
```

---

## 📝 Notes

- All dates should be in ISO 8601 format
- Coordinates are in [longitude, latitude] format (GeoJSON standard)
- Prices are in INR (Indian Rupees)
- All endpoints return JSON responses
- Token expires after 30 days
- Admin routes require role='admin'

---

**API Version:** 1.0.0  
**Last Updated:** 2024
