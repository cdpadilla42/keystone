const { Text, Integer, Relationship } = require('@keystonejs/fields');
const { rules } = require('../../access');

module.exports = [
  'Order',
  {
    fields: {
      items: { type: Relationship, ref: 'OrderItem', many: true },
      charge: { type: Text, required: true },

      total: { type: Integer, required: true },
    },
    // List-level access controls
    access: {
      read: true,
      update: rules.canManageOrders,
      create: rules.canManageOrders,
      delete: rules.canManageOrders,
    },
  },
];
