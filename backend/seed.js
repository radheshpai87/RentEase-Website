import mongoose from 'mongoose';
import Location from './models/Location.js';
import Category from './models/Category.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rentease');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Location.deleteMany({});
    await Category.deleteMany({});

    // Create locations
    const locations = [
      {
        state: 'Maharashtra',
        city: 'Mumbai',
        town: 'Andheri',
        locality: 'Andheri West',
        pincode: '400058'
      },
      {
        state: 'Maharashtra',
        city: 'Mumbai',
        town: 'Bandra',
        locality: 'Bandra West',
        pincode: '400050'
      },
      {
        state: 'Karnataka',
        city: 'Bangalore',
        town: 'Koramangala',
        locality: 'Koramangala 4th Block',
        pincode: '560034'
      },
      {
        state: 'Delhi',
        city: 'New Delhi',
        town: 'Connaught Place',
        locality: 'CP Block',
        pincode: '110001'
      }
    ];

    const insertedLocations = await Location.insertMany(locations);
    console.log(`Created ${insertedLocations.length} locations`);

    // Create categories
    const categories = [
      { name: 'Residential', description: 'Residential properties for living' },
      { name: 'Commercial', description: 'Commercial properties for business' },
      { name: 'Industrial', description: 'Industrial properties for manufacturing' },
      { name: 'Agricultural', description: 'Agricultural land and farms' }
    ];

    const insertedCategories = await Category.insertMany(categories);
    console.log(`Created ${insertedCategories.length} categories`);

    console.log('Sample data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();