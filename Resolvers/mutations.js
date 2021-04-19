const checkout = require('./mutations/checkout');
const sendMail = require('./mutations/sendMail');

const graphql = String.raw;

const mutations = [
  {
    schema: graphql`checkout(token: String!, cart: CartInput!): Order!`,
    resolver: checkout,
  },
  {
    schema: graphql`sendMail : String`,
    resolver: sendMail,
  },
];

module.exports = mutations;
