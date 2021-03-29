const graphql = String.raw;

exports.types = graphql`
  type Item {
    img: String!
    name: String!
    description: String
    category: String
    _id: ID
    price: Int!
    customizations: [Customization!]
  }

  type Customization {
    name: String!
    title: String!
    required: Boolean!
    options: [Option!]
    selectMultiple: Boolean
  }

  type Option {
    name: String!
    price: Int
  }

  type OrderItem {
    _id: ID!
    name: String!
    description: String!
    image: String!
    price: Int!
    quantity: Int!
  }

  type Order {
    _id: ID!
    items: [OrderItem!]!
    total: Int!
    charge: String!
  }
`;

const schema = graphql`
  testMe: String
`;

const testMe = () => {
  return 'yay!';
};

exports.queries = [
  {
    schema: schema,
    resolver: testMe,
  },
];
