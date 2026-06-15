import mongoose from 'mongoose';

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    emailSubject: { type: String, required: true },
    message: { type: String, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
