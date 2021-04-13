const { Text, Relationship } = require('@keystonejs/fields');
const { rules } = require('../../access');

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
      update: rules.canManagePermissions,
      create: rules.canManagePermissions,
      delete: rules.canManagePermissions,
    },
  },
];
