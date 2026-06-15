import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import newsletterRoutes from './routes/newsletter.js';
import authRoutes from './routes/auth.js';
import NewsletterSubscriber from './models/NewsletterSubscriber.js';
import User from './models/User.js';

const app = express();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quirky-fruity';

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/users', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
  await Promise.all([
    NewsletterSubscriber.syncIndexes(),
    User.syncIndexes(),
  ]);
}

export { app, connectDB };
