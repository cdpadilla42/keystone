const { Text, Integer, Relationship } = require('@keystonejs/fields');
const { permissions } = require('../../access');

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
      read: permissions.canManageOrders,
      update: true,
      create: true,
      delete: true,
      auth: true,
    },
  },
];
