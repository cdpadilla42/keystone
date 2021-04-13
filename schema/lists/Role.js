const { Text, Relationship } = require('@keystonejs/fields');
const { permissionFields } = require('./permissionFields');

module.exports = [
  'Role',
  {
    fields: {
      name: { type: Text, required: true },
      description: { type: Text, required: true },
      ...permissionFields,
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