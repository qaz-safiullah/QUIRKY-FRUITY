import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: String, required: true },
    customerName: { type: String, default: '' },
    customerEmail: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
