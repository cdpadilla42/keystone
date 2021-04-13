const { Text, Integer, Relationship } = require('@keystonejs/fields');
const access = require('../../access');

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
      update: true,
      create: true,
      delete: access.userIsAdmin,
      auth: true,
    },
  },
];
