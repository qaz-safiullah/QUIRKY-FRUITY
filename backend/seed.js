import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quirky-fruity';

const products = [
  {
    id: 1,
    name: 'Orange Juice',
    price: '$3.20',
    stock: 50,
    image: '/images/char-orange.png',
    burstImage: '/images/burst-cream-orange.png',
  },
  {
    id: 2,
    name: 'Pineapple Juice',
    price: '$3.20',
    stock: 50,
    image: '/images/char-pineapple.png',
    burstImage: '/images/burst-cream-pineapple.png',
  },
  {
    id: 3,
    name: 'Papaya Juice',
    price: '$3.20',
    stock: 50,
    image: '/images/char-papaya.png',
    burstImage: '/images/burst-cream-papaya.png',
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Product.deleteMany({});
  console.log('Cleared existing products');

  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);

  await mongoose.disconnect();
  console.log('Done');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
