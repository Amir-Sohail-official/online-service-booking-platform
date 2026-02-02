# Online Service Booking Platform

A full-stack MERN application for booking services online with role-based access control (User, Service Provider, Admin).

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access
- **User Features**: View services, book services, track bookings, add reviews
- **Service Provider Features**: View assigned bookings, update booking status
- **Admin Features**: Manage services, view all users, providers, and bookings
- **Modern UI**: Built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB Atlas

## Project Structure

```
Online Service Booking Platform/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/            # Route controllers
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── models/                 # Mongoose models
│   ├── routes/                 # Express routes
│   ├── scripts/
│   │   └── seedData.js        # Seed data script
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── utils/
│   │   │   └── api.js        # API utility
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
PORT=5000
MONGO_URI=mongodb+srv://wonderuser:amkhan123@cluster0.6kbgpgc.mongodb.net/service_booking_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Seed the database (optional, but recommended for initial data):
```bash
npm run seed
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Default Accounts

After running the seed script, you can use these accounts:

- **Admin**: 
  - Email: `admin@example.com`
  - Password: `admin123`

- **Service Provider**: 
  - Email: `provider@example.com`
  - Password: `provider123`

You can also register new accounts through the registration page.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Services
- `GET /api/services` - Get all services (protected)
- `GET /api/services/:id` - Get service by ID (protected)
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/my-bookings` - Get user bookings (protected)
- `GET /api/bookings/provider` - Get provider bookings (provider/admin)
- `GET /api/bookings/all` - Get all bookings (admin only)
- `PUT /api/bookings/:id/status` - Update booking status (provider/admin)

### Reviews
- `POST /api/reviews` - Create review (protected)
- `GET /api/reviews` - Get all reviews (protected)
- `DELETE /api/reviews/:id` - Delete review (owner only)

### Users
- `GET /api/users/all` - Get all users (admin only)
- `GET /api/users/providers` - Get all providers (admin only)

## Deployment

### Backend (Railway / Vercel)

1. Set environment variables in your deployment platform:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT` (usually auto-set by platform)
   - `NODE_ENV=production`

2. Deploy the backend folder

### Frontend (Vercel / Netlify)

1. Set environment variable:
   - `VITE_API_URL` (your backend API URL)

2. Build and deploy:
```bash
npm run build
```

## Features by Role

### User
- Register and login
- View available services
- Book services with date, time, and address
- View booking status (pending, approved, completed)
- Add reviews after service completion
- View and delete own reviews

### Service Provider
- Login
- View assigned bookings
- Update booking status (pending → approved → completed)

### Admin
- Login
- View all users and providers
- Manage services (add, update, delete)
- View all bookings
- Full system access

## Database Models

- **User**: name, email, password, role, phone
- **Service**: name, description, price, duration, category
- **Booking**: user, service, provider, bookingDate, bookingTime, status, address
- **Review**: user, service, booking, rating, comment

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes with middleware
- Role-based access control
- Environment variables for sensitive data

## License

This project is open source and available for educational purposes.








