const { Text, Relationship } = require('@keystonejs/fields');

module.exports = [
  'Role',
  {
    fields: {
      name: { type: Text, required: true },
      description: { type: Text, required: true },
      assignedTo: { type: Relationship, ref: 'User' },
    },
    // List-level access controls
    access: {
      read: true,
      update: true,
      create: true,
      delete: true,
      auth: true,
    },
  },
];
