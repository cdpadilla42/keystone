const stripe = require('stripe');
require('dotenv').config({ path: '.env' });

const stripeConfig = new stripe(process.env.STRIPE_SECRET || '', {
  apiVersion: '2020-08-27',
});

module.exports = stripeConfig;
