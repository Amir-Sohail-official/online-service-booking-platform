import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const email = 'amirkhan46509@gmail.com';
    const adminExists = await User.findOne({ email });

    if (adminExists) {
      // Update existing user to admin if not already
      if (adminExists.role !== 'admin') {
        adminExists.role = 'admin';
        await adminExists.save();
        console.log('✅ Existing user updated to admin role');
      } else {
        console.log('✅ Admin user already exists with correct role');
      }
      console.log('Admin Details:');
      console.log('  Email:', adminExists.email);
      console.log('  Name:', adminExists.name);
      console.log('  Role:', adminExists.role);
    } else {
      // Create new admin user
      const admin = await User.create({
        name: 'Amir Khan',
        email: email,
        password: 'amkhan123',
        role: 'admin',
        phone: '03351946509',
      });
      console.log('✅ Admin user created successfully!');
      console.log('Admin Details:');
      console.log('  Email:', admin.email);
      console.log('  Password: amkhan123');
      console.log('  Role:', admin.role);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();




