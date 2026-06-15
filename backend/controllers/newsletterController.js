import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

export const subscribe = async (req, res) => {
  try {
    const { firstName, lastName, emailSubject, message, email } = req.body;

    if (!firstName || !lastName || !emailSubject || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const subscriber = await NewsletterSubscriber.create({
      firstName,
      lastName,
      emailSubject,
      message: message || '',
      email,
    });

    res.status(201).json({ message: 'Subscribed successfully', subscriber });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already subscribed' });
    }
    res.status(500).json({ error: 'Failed to subscribe' });
  }
};
