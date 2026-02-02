import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import Service from './models/Service.js';
import User from './models/User.js';

import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration
// In production, you can restrict to specific frontend URL via FRONTEND_URL env variable
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Use FRONTEND_URL env var or allow all
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const seedInitialData = async () => {
  try {
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      const seedServices = [
        {
          name: 'Electrician',
          description: 'Professional electrical services including wiring, repairs, and installations',
          price: 150,
          duration: 2,
          category: 'Electrical',
        },
        {
          name: 'Plumber',
          description: 'Expert plumbing services for leaks, installations, and repairs',
          price: 120,
          duration: 2,
          category: 'Plumbing',
        },
        {
          name: 'Cleaner',
          description: 'Thorough cleaning services for homes and offices',
          price: 80,
          duration: 3,
          category: 'Cleaning',
        },
        {
          name: 'Painter',
          description: 'Professional painting services for interior and exterior walls',
          price: 200,
          duration: 4,
          category: 'Painting',
        },
      ];
      await Service.insertMany(seedServices);
      console.log('Initial services seeded successfully');
    }

    const adminExists = await User.findOne({ email: 'amirkhan46509@gmail.com' });
    if (!adminExists) {
      await User.create({
        name: 'Amir Khan',
        email: 'amirkhan46509@gmail.com',
        password: 'amkhan123',
        role: 'admin',
        phone: '03351946509',
      });
      console.log('Admin user created');
    }

  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await seedInitialData();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

