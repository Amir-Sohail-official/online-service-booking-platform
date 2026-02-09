import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import Service from '../models/Service.js';
import User from '../models/User.js';

dotenv.config();

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
  {
    name: 'HVAC Technician',
    description: 'Heating, ventilation, and air conditioning installation, repair, and maintenance',
    price: 180,
    duration: 3,
    category: 'HVAC',
  },
  {
    name: 'Carpenter',
    description: 'Custom furniture, cabinets, shelves, and woodwork installations',
    price: 160,
    duration: 4,
    category: 'Carpentry',
  },
  {
    name: 'Locksmith',
    description: 'Lock installation, repair, key duplication, and emergency lockout services',
    price: 100,
    duration: 1,
    category: 'Security',
  },
  {
    name: 'Landscaper',
    description: 'Garden design, lawn care, tree trimming, and outdoor space maintenance',
    price: 140,
    duration: 4,
    category: 'Landscaping',
  },
  {
    name: 'Appliance Repair',
    description: 'Repair and maintenance for washing machines, dryers, refrigerators, and more',
    price: 130,
    duration: 2,
    category: 'Appliance',
  },
  {
    name: 'Moving Service',
    description: 'Professional moving and relocation services for homes and offices',
    price: 250,
    duration: 6,
    category: 'Moving',
  },
  {
    name: 'Handyman',
    description: 'General home repairs, installations, and maintenance tasks',
    price: 110,
    duration: 3,
    category: 'Maintenance',
  },
  {
    name: 'Carpet Cleaning',
    description: 'Deep cleaning, stain removal, and sanitization for carpets and rugs',
    price: 90,
    duration: 2,
    category: 'Cleaning',
  },
  {
    name: 'Pest Control',
    description: 'Professional pest extermination and prevention services',
    price: 120,
    duration: 2,
    category: 'Pest Control',
  },
  {
    name: 'Roofing',
    description: 'Roof repair, installation, inspection, and maintenance services',
    price: 300,
    duration: 6,
    category: 'Construction',
  },
  {
    name: 'Tiler',
    description: 'Tile installation and repair for floors, walls, and bathrooms',
    price: 170,
    duration: 4,
    category: 'Construction',
  },
  {
    name: 'Window Cleaning',
    description: 'Interior and exterior window cleaning for residential and commercial properties',
    price: 85,
    duration: 2,
    category: 'Cleaning',
  },
  {
    name: 'Flooring',
    description: 'Hardwood, laminate, and vinyl floor installation and repair',
    price: 220,
    duration: 5,
    category: 'Construction',
  },
  {
    name: 'Drywall Repair',
    description: 'Drywall installation, patching, and finishing services',
    price: 150,
    duration: 3,
    category: 'Construction',
  },
  {
    name: 'Garage Door Repair',
    description: 'Garage door installation, repair, and maintenance services',
    price: 140,
    duration: 2,
    category: 'Maintenance',
  },
  {
    name: 'Gutter Cleaning',
    description: 'Gutter cleaning, repair, and installation services',
    price: 100,
    duration: 2,
    category: 'Maintenance',
  },
  {
    name: 'Pressure Washing',
    description: 'Exterior pressure washing for driveways, patios, and building exteriors',
    price: 120,
    duration: 3,
    category: 'Cleaning',
  },
];

const seedUsers = async () => {
  try {
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
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Get existing service names
    const existingServices = await Service.find({}, 'name');
    const existingNames = existingServices.map(s => s.name.toLowerCase());

    // Filter out services that already exist
    const newServices = seedServices.filter(
      service => !existingNames.includes(service.name.toLowerCase())
    );

    if (newServices.length > 0) {
      await Service.insertMany(newServices);
      console.log(`${newServices.length} new service(s) added successfully`);
    } else {
      console.log('All services already exist, skipping seed');
    }

    await seedUsers();

    console.log('Seed data completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();




