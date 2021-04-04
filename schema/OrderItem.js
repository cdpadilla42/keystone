const { Text, Integer } = require('@keystonejs/fields');

module.exports = [
  'OrderItem',
  {
    fields: {
      name: { type: Text, required: true },
      description: { type: Text, required: true },
      image: { type: Text, required: false },
      price: { type: Integer, required: true },
      quantity: { type: Integer, required: true },
      order: { type: Relationship, ref: 'Order' },
    },
    // List-level access controls
    access: {
      read: true,
      update: true,
      create: true,
      delete: access.userIsAdmin,
      auth: true,
    },
  },
];
