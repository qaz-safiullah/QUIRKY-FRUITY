import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    stock: { type: Number, required: true, default: 50 },
    image: { type: String, required: true },
    burstImage: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
