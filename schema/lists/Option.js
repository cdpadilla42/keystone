const { Text, Integer } = require('@keystonejs/fields');
const access = require('../../access');

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
      update: true,
      create: true,
      delete: access.userIsAdmin,
      auth: true,
    },
  },
];
