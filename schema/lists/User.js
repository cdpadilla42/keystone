const { Text, Relationship, Password } = require('@keystonejs/fields');
const access = require('../../access');
const permissionFields = require('./permissionFields');

module.exports = [
  'User',
  {
    fields: {
      name: { type: Text },
      email: {
        type: Text,
        isUnique: true,
      },
      assignedTo: {
        type: Relationship,
        ref: 'Role',
        // Field-level access controls
        // Here, we set more restrictive field access so a non-admin cannot make themselves admin.
        // access: {
        //   update: access.userIsAdmin,
        // },
      },
      password: {
        type: Password,
      },
      ...permissionFields,
    },
    // List-level access controls
    access: {
      read: true,
      update: access.userIsAdminOrOwner,
      create: true,
      delete: access.userIsAdmin,
      auth: true,
    },
  },
];
