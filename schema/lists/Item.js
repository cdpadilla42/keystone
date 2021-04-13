const { Text, Integer, Relationship } = require('@keystonejs/fields');
const { rules } = require('../../access');

module.exports = [
  'Item',
  {
    fields: {
      name: { type: Text },
      img: { type: Text },
      price: { type: Integer },
      category: { type: Text },
      description: { type: Text },
      customizations: {
        type: Relationship,
        ref: 'Customization',
        many: true,
      },
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
