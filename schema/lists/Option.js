const { Text, Integer } = require('@keystonejs/fields');
const { rules } = require('../../access');

module.exports = [
  'Option',
  {
    fields: {
      name: { type: Text, required: true },
      price: { type: Integer },
    },
    // List-level access controls
    access: {
      read: true,
      update: rules.canManageProducts,
      create: rules.canManageProducts,
      delete: rules.canManageProducts,
    },
  },
];
