import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    for (const item of items) {
      const product = await Product.findOne({ id: item.productId });
      if (!product) {
        return res.status(404).json({ error: `Product ${item.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
    }

    const total = items
      .reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')) * item.quantity, 0)
      .toFixed(2);

    const order = await Order.create({
      user: req.user._id,
      items,
      total: `$${total}`,
      customerName: req.user.name || '',
      customerEmail: req.user.email || '',
    });

    for (const item of items) {
      await Product.updateOne(
        { id: item.productId },
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrderCount = async (req, res) => {
  try {
    const count = await Order.countDocuments({ user: req.user._id });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch count' });
  }
};
