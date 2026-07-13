// Run with: npm run seed
// Populates the database with sample products (including a couple of demo
// reviews on the first two products) and an admin user.
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const sampleProducts = [
  { name: 'Wireless Headphones', description: 'Over-ear Bluetooth headphones with noise cancellation.', price: 2499, category: 'Electronics', stock: 25 },
  { name: 'Running Shoes', description: 'Lightweight breathable running shoes for daily training.', price: 1899, category: 'Footwear', stock: 40 },
  { name: 'Coffee Maker', description: '12-cup programmable drip coffee maker.', price: 2299, category: 'Home', stock: 15 },
  { name: 'Yoga Mat', description: 'Non-slip eco-friendly yoga mat, 6mm thick.', price: 699, category: 'Fitness', stock: 60 },
  { name: 'Backpack', description: 'Water-resistant laptop backpack with USB charging port.', price: 1499, category: 'Accessories', stock: 30 },
  { name: 'Smart Watch', description: 'Fitness tracking smartwatch with heart rate monitor.', price: 3999, category: 'Electronics', stock: 18 },
  { name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness and color temperature.', price: 899, category: 'Home', stock: 50 },
  { name: 'Water Bottle', description: 'Insulated stainless steel water bottle, 750ml.', price: 499, category: 'Accessories', stock: 100 },
];

const seedData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();

    let admin = await User.findOne({ email: 'admin@shopez.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email: 'admin@shopez.com',
        password: 'admin123',
        role: 'ADMIN',
      });
      console.log('Admin user created: admin@shopez.com / admin123');
    }

    const productsWithCreator = sampleProducts.map((p) => ({ ...p, createdBy: admin._id }));
    const inserted = await Product.insertMany(productsWithCreator);

    // Add a couple of demo reviews (using the admin account as the reviewer)
    // to the first two products, purely so the review UI has something to
    // show right after seeding, without needing to manually submit one first.
    const headphones = inserted[0];
    headphones.reviews.push(
      { user: admin._id, name: 'Admin', rating: 5, comment: 'Excellent sound quality and battery life!' },
      { user: admin._id, name: 'Admin', rating: 4, comment: 'Very comfortable for long use, slightly pricey.' }
    );
    headphones.numReviews = headphones.reviews.length;
    headphones.rating = headphones.reviews.reduce((s, r) => s + r.rating, 0) / headphones.reviews.length;
    await headphones.save();

    const shoes = inserted[1];
    shoes.reviews.push({ user: admin._id, name: 'Admin', rating: 5, comment: 'Great grip and very lightweight.' });
    shoes.numReviews = shoes.reviews.length;
    shoes.rating = shoes.reviews.reduce((s, r) => s + r.rating, 0) / shoes.reviews.length;
    await shoes.save();

    console.log('Sample products (with demo reviews) inserted successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
