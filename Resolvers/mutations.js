const { default: createOrder } = require('./mutations/createOrder');

const graphql = String.raw;

const mutations = [
  {
    schema: graphql`createOrder(token: String!, cart: CartInput!): Order!`,
    resolver: createOrder,
  },
];

module.exports = mutations;
