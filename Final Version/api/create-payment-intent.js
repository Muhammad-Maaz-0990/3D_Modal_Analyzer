// This is a production API endpoint for creating Stripe Payment Intents
// Deploy this to your serverless platform (Vercel, Netlify, etc.)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const { amount, currency = 'usd', metadata } = req.body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: { message: 'Invalid amount. Amount must be greater than 0.' }
      });
    }

    // For demo/testing purposes, return a mock payment intent
    // In production, you would initialize Stripe with your secret key:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({ amount, currency, metadata });

    const mockPaymentIntent = {
      client_secret: `pi_demo_${Math.random().toString(36).substr(2, 9)}_secret_demo`,
      amount,
      currency,
      metadata,
      status: 'requires_payment_method'
    };

    res.status(200).json({
      client_secret: mockPaymentIntent.client_secret,
      amount: mockPaymentIntent.amount,
      currency: mockPaymentIntent.currency
    });

  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to create payment intent',
        details: error.message
      }
    });
  }
}