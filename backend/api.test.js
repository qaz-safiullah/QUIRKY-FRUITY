import { app, connectDB } from './app.js';
import mongoose from 'mongoose';
import supertest from 'supertest';
import User from './models/User.js';
import Order from './models/Order.js';
import Product from './models/Product.js';

const request = supertest(app);

let testToken = '';
let testUserId = '';
const TEST_USER = { name: 'Test User', email: 'test@jest-run.com', password: 'test123456' };

beforeAll(async () => {
  await connectDB();
  const existing = await User.findOne({ email: TEST_USER.email });
  if (existing) {
    await Order.deleteMany({ user: existing._id });
    await User.deleteOne({ _id: existing._id });
  }
});

afterAll(async () => {
  const existing = await User.findOne({ email: TEST_USER.email });
  if (existing) await User.deleteOne({ _id: existing._id });
  await mongoose.disconnect();
});

describe('AUTH — Registration', () => {
  it('POST /api/users/register — creates user and returns JWT', async () => {
    const res = await request.post('/api/users/register').send(TEST_USER);
    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(TEST_USER.email);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.password).toBeUndefined();
    testToken = res.body.token;
    testUserId = res.body.user._id;
  });

  it('POST /api/users/register — rejects duplicate email', async () => {
    const res = await request.post('/api/users/register').send(TEST_USER);
    expect(res.status).toBe(409);
  });

  it('POST /api/users/register — rejects missing fields', async () => {
    const res = await request.post('/api/users/register').send({ email: 'x@y.com' });
    expect(res.status).toBe(400);
  });
});

describe('AUTH — Login', () => {
  it('POST /api/users/login — returns JWT for valid credentials', async () => {
    const res = await request.post('/api/users/login').send({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    testToken = res.body.token;
  });

  it('POST /api/users/login — rejects wrong password', async () => {
    const res = await request.post('/api/users/login').send({
      email: TEST_USER.email,
      password: 'wrongpass',
    });
    expect(res.status).toBe(401);
  });

  it('POST /api/users/login — rejects missing fields', async () => {
    const res = await request.post('/api/users/login').send({});
    expect(res.status).toBe(400);
  });
});

describe('AUTH — Profile', () => {
  it('GET /api/users/profile — returns user when authenticated', async () => {
    const res = await request.get('/api/users/profile').set('Authorization', `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(TEST_USER.email);
  });

  it('GET /api/users/profile — rejects without token', async () => {
    const res = await request.get('/api/users/profile');
    expect(res.status).toBe(401);
  });

  it('PUT /api/users/profile — updates name', async () => {
    const res = await request
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ name: 'Updated Name' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  it('PUT /api/users/profile — updates password', async () => {
    const res = await request
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ password: 'newpass123456' });
    expect(res.status).toBe(200);

    const loginRes = await request.post('/api/users/login').send({
      email: TEST_USER.email,
      password: 'newpass123456',
    });
    expect(loginRes.status).toBe(200);
    testToken = loginRes.body.token;
  });
});

describe('AUTH — Forgot & Reset Password', () => {
  it('POST /api/users/forgot-password — finds existing email', async () => {
    const res = await request.post('/api/users/forgot-password').send({ email: TEST_USER.email });
    expect(res.status).toBe(200);
    expect(res.body.exists).toBe(true);
  });

  it('POST /api/users/forgot-password — rejects unknown email', async () => {
    const res = await request.post('/api/users/forgot-password').send({ email: 'noone@nowhere.com' });
    expect(res.status).toBe(404);
  });

  it('POST /api/users/reset-password — updates password', async () => {
    const res = await request.post('/api/users/reset-password').send({
      email: TEST_USER.email,
      password: 'reset123456',
    });
    expect(res.status).toBe(200);

    const loginRes = await request.post('/api/users/login').send({
      email: TEST_USER.email,
      password: 'reset123456',
    });
    expect(loginRes.status).toBe(200);
    testToken = loginRes.body.token;

    await request
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ password: TEST_USER.password });
  });
});

describe('ORDERS — Protected Endpoints', () => {
  let testProductId = 1;

  beforeAll(async () => {
    const product = await Product.findOne({ id: 1 });
    if (!product) {
      await Product.create({
        id: 1,
        name: 'Test Juice',
        price: '$5.00',
        stock: 100,
        image: '/images/test.png',
        burstImage: '/images/test-burst.png',
      });
    }
    testProductId = 1;
  });

  it('POST /api/orders — creates order when authenticated', async () => {
    const res = await request
      .post('/api/orders')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        items: [{ productId: testProductId, name: 'Test Juice', price: '$5.00', quantity: 2 }],
      });
    expect(res.status).toBe(201);
    expect(res.body.total).toBe('$10.00');
    expect(res.body.items).toHaveLength(1);
  });

  it('POST /api/orders — rejects without auth', async () => {
    const res = await request.post('/api/orders').send({
      items: [{ productId: testProductId, name: 'Test Juice', price: '$5.00', quantity: 1 }],
    });
    expect(res.status).toBe(401);
  });

  it('GET /api/orders/myorders — returns user orders', async () => {
    const res = await request
      .get('/api/orders/myorders')
      .set('Authorization', `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/orders/count — returns order count', async () => {
    const res = await request
      .get('/api/orders/count')
      .set('Authorization', `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThanOrEqual(1);
  });
});

describe('PRODUCTS — Public Endpoints', () => {
  it('GET /api/products — returns product list', async () => {
    const res = await request.get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });
});

describe('NEWSLETTER — Public Endpoint', () => {
  it('POST /api/newsletter — subscribes email', async () => {
    const res = await request.post('/api/newsletter').send({
      firstName: 'Jest',
      lastName: 'Test',
      email: 'jest-test@newsletter.com',
      emailSubject: 'Test',
      message: 'Testing',
    });
    expect(res.status).toBe(201);
  });

  afterAll(async () => {
    const NewsletterSubscriber = (await import('./models/NewsletterSubscriber.js')).default;
    await NewsletterSubscriber.deleteOne({ email: 'jest-test@newsletter.com' });
  });
});
