# 🎉 Updated Bike Rental Application

## ✅ Latest Updates

### 1. **Increased Rental Rates (More Realistic Pricing)**

| Bike Model | Daily Rate | Hourly Rate | Security Deposit |
|------------|------------|-------------|------------------|
| **KTM RC 390** (Premium Sport) | ₹3,000 | ₹300 | ₹6,000 |
| **KTM Duke 390** | ₹2,500 | ₹250 | ₹5,000 |
| **Royal Enfield Himalayan** | ₹2,200 | ₹220 | ₹4,500 |
| **KTM Duke 250** | ₹2,000 | ₹200 | ₹4,000 |
| **Royal Enfield Meteor 350** | ₹1,900 | ₹190 | ₹3,500 |
| **Royal Enfield Classic 350** | ₹1,800 | ₹180 | ₹3,000 |
| **Scotty Cruiser 250** | ₹1,600 | ₹160 | ₹3,000 |
| **Scotty Sport 200** | ₹1,200 | ₹120 | ₹2,000 |

### 2. **Security Deposit System**
- ✅ Security deposit added to all bikes
- ✅ Deposit amount varies based on bike value (₹2,000 - ₹6,000)
- ✅ Displayed on bike cards and booking page
- ✅ Included in total payment amount
- ✅ Refundable after bike return
- ✅ Clear breakdown shown during booking

### 3. **Payment System Fixed**
- ✅ Removed Stripe dependency (no API keys needed)
- ✅ Simple card payment form
- ✅ Works with any card details (test mode)
- ✅ UPI payment option available
- ✅ Payment confirmation and booking status update

### 4. **Enhanced Booking Details**
- ✅ Rental amount shown separately
- ✅ Security deposit highlighted in blue
- ✅ Total amount = Rental + Security Deposit
- ✅ Clear note about deposit refund

## 🚀 How to Run

### Terminal 1 - Backend Server:
```powershell
cd "c:\Users\VAMSINADH\bike rental full stack\server"
npm start
```

### Terminal 2 - Frontend:
```powershell
cd "c:\Users\VAMSINADH\bike rental full stack\client"
npm run dev
```

## 🔑 Login Credentials

**Admin Account:**
- Email: `admin@bikerental.com`
- Password: `admin123`
- Access: Full dashboard, manage bikes, bookings, reports

**User Account:**
- Email: `john@example.com`
- Password: `password123`
- Access: Browse bikes, make bookings, view history

## 💳 Test Payment Details

Use any of these for testing:

**Card Payment:**
```
Card Number: 4242 4242 4242 4242
Cardholder Name: Test User
Expiry Date: 12/25
CVV: 123
```

**Or:**
```
Card Number: 1234 5678 9012 3456
Cardholder Name: Your Name
Expiry Date: Any future date
CVV: Any 3 digits
```

## 📊 Example Booking Calculation

**Booking: KTM Duke 390 for 3 days**

```
Rental Rate: ₹2,500/day
Duration: 3 days
Rental Amount: ₹2,500 × 3 = ₹7,500
Security Deposit: ₹5,000
─────────────────────────────
Total Payment: ₹12,500

After Return: ₹5,000 refunded
Actual Cost: ₹7,500
```

## 🌐 Access URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

## 📱 Features Working

✅ User Registration & Login  
✅ Browse 8 Premium Bikes  
✅ Filter by Brand (KTM, Royal Enfield, Scotty)  
✅ View Detailed Bike Specifications  
✅ Hourly & Daily Rental Options  
✅ Security Deposit System  
✅ Real-time Price Calculation  
✅ Payment Processing (Simplified)  
✅ Booking Management  
✅ Booking Cancellation with Refund  
✅ Live Tracking (Socket.io)  
✅ Admin Dashboard  
✅ Daily Reports & Analytics  
✅ Revenue Tracking  

## 🎯 What's New

1. **Realistic Pricing** - Rates increased to match real-world bike rental prices
2. **Security Deposits** - Added refundable security deposits for all bikes
3. **Better UI** - Security deposit clearly shown with blue highlight
4. **Payment Fixed** - No external dependencies, works immediately
5. **8 Bikes Available** - More variety for users to choose from

## 🔧 No Setup Required

- ❌ No MongoDB installation needed (uses JSON files)
- ❌ No Stripe API keys needed (simplified payment)
- ❌ No complex configuration
- ✅ Just run and use!

---

**Ready to use! Start both servers and access http://localhost:5173** 🚀
