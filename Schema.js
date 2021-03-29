const graphql = String.raw;

exports.types = graphql`
  type Customization {
    name: String!
    title: String!
    required: Boolean!
    # options: [Option!]
    selectMultiple: Boolean
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
