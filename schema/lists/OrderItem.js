const { Text, Integer, Relationship } = require('@keystonejs/fields');
const { rules } = require('../../access');

module.exports = [
  'OrderItem',
  {
    fields: {
      name: { type: Text, required: true },
      description: { type: Text, required: true },
      image: { type: Text, required: false },
      price: { type: Integer, required: true },
      quantity: { type: Integer, required: true },
      order: { type: Relationship, ref: 'Order.items' },
    },
    // List-level access controls
    access: {
      read: rules.canSeeOrderItem,
      update: rules.canManageOrders,
      create: rules.canManageOrders,
      delete: rules.canManageOrders,
    },
  },
];
