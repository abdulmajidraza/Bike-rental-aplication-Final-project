# 🚀 Quick Setup Guide

Follow these steps to get your Bike Rental application up and running.

## Step 1: Install MongoDB

### Windows
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and follow the installation wizard
3. MongoDB will start automatically as a Windows service

### Verify MongoDB is running
```bash
mongosh
```

If you see the MongoDB shell, you're good to go!

## Step 2: Install Dependencies

Open PowerShell in the project root directory:

```powershell
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Go back to root
cd ..
```

## Step 3: Configure Environment Variables

### Server Configuration

1. Copy the example file:
```powershell
cd server
Copy-Item .env.example .env
```

2. Edit `server/.env` and add your values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bike-rental
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Getting Stripe Keys:**
1. Sign up at https://stripe.com
2. Go to Developers > API keys
3. Copy your test keys (starts with `sk_test_` and `pk_test_`)

### Client Configuration

1. Copy the example file:
```powershell
cd ../client
Copy-Item .env.example .env
```

2. Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

## Step 4: Seed the Database

```powershell
cd ../server
node seed.js
```

You should see:
```
✅ Bikes seeded successfully
✅ Users seeded successfully
🎉 Database seeded successfully!
```

## Step 5: Start the Application

### Option 1: Start Everything at Once (Recommended)

From the root directory:
```powershell
npm run dev
```

This starts both backend and frontend simultaneously.

### Option 2: Start Separately

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
```

## Step 6: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

## Step 7: Login

Use these default credentials:

**Admin Account:**
- Email: `admin@bikerental.com`
- Password: `admin123`

**Regular User:**
- Email: `john@example.com`
- Password: `password123`

## 🎉 You're All Set!

### What to Try First:

1. **As a User:**
   - Browse bikes at http://localhost:5173/bikes
   - Click on a bike to view details
   - Try booking a bike (use Stripe test card: 4242 4242 4242 4242)
   - View your bookings

2. **As an Admin:**
   - Login with admin credentials
   - Go to Admin Dashboard
   - Add new bikes
   - View reports and analytics

## 🧪 Stripe Test Cards

For testing payments, use these test card numbers:

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires Authentication:** 4000 0025 0000 3155

Use any future expiry date, any 3-digit CVC, and any postal code.

## ❗ Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running. Start it with:
```powershell
net start MongoDB
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process using that port or change the PORT in `.env`

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:** Run `npm install` in the server directory

### Vite Build Error
**Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install` again

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the API endpoints
- Customize the bike data in `server/seed.js`
- Add your own bike images
- Configure email notifications (future enhancement)

## 🆘 Need Help?

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running
4. Check that all dependencies are installed
5. Try restarting the servers

Happy Coding! 🏍️
