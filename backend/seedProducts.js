require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product.model');

const products = [
  {
    name: 'Noise Cancelling Headphones',
    description: 'Wireless over-ear headphones with active noise cancellation.',
    price: 4999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    stock: 25,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with blue switches and a compact layout.',
    price: 2999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
    stock: 10,
  },
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Soft and breathable everyday cotton t-shirt for casual wear.',
    price: 999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    stock: 40,
  },
  {
    name: 'JavaScript Fundamentals',
    description: 'A practical guide to modern JavaScript, ES6+, and frontend patterns.',
    price: 599,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
    stock: 18,
  },
  {
    name: 'Minimal Desk Lamp',
    description: 'Warm LED desk lamp designed for a clean and focused workspace.',
    price: 1499,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    stock: 14,
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Track your workouts, sleep, and health metrics with a lightweight smartwatch.',
    price: 3999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    stock: 12,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Sample products inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error.message);
    process.exit(1);
  }
};

seedProducts();
