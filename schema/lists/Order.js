const { Text, Integer, Relationship } = require('@keystonejs/fields');
const { rules } = require('../../access');

module.exports = [
  'Order',
  {
    fields: {
      items: { type: Relationship, ref: 'OrderItem.order', many: true },
      charge: { type: Text, required: true },
      total: { type: Integer, required: true },
      user: { type: Relationship, ref: 'User.orders', many: false },
    },
    // List-level access controls
    access: {
      read: rules.canSeeOrder,
      update: rules.canManageOrders,
      create: rules.canManageOrders,
      delete: rules.canManageOrders,
    },
  },
];
