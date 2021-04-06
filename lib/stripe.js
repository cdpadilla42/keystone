const stripe = require('stripe');
require('dotenv').config({ path: '.env' });

console.log(process.env.STRIPE_SECRET);

const stripeConfig = new stripe(process.env.STRIPE_SECRET || '', {
  apiVersion: '2020-08-27',
});

module.exports = stripeConfig;
