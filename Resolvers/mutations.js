const checkout = require('./mutations/checkout');

const graphql = String.raw;

const mutations = [
  {
    schema: graphql`checkout(token: String!, cart: CartInput!): Order!`,
    resolver: checkout,
  },
];

module.exports = mutations;
